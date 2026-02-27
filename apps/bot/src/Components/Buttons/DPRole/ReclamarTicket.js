import {
  ButtonInteraction,
  ButtonBuilder,
  ButtonStyle,
  MediaGalleryItemBuilder,
  ContainerBuilder,
  SeparatorSpacingSize,
  UserSelectMenuBuilder,
} from 'discord.js';
import TicketUserDR from '#database/models/DPRole/TicketUserDR.js';
import { CacheManager } from '#utils/CacheManager.js';

export default {
  customId: 'ClaimDR',

  /**
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply({ flags: 'Ephemeral' });

    const { guild, member, user, channel, message } = interaction;

    const setup = await CacheManager.getTicketSetupDR(guild.id);
    if (!setup) {
      return interaction.editReply({ content: 'Configuracion no encontrada.' });
    }

    const hasPermission =
      member.roles.cache.has(setup.SpInterno) ||
      member.roles.cache.has(setup.Supervisor) ||
      member.roles.cache.has(setup.SupGeneral);

    if (!hasPermission) {
      return interaction.editReply({ content: 'No tienes permisos para reclamar tickets.' });
    }

    const ticket = await TicketUserDR.findOne({ ChannelId: channel.id });
    if (!ticket || ticket.Estado !== 'abierto' || ticket.StaffAsignado) {
      return interaction.editReply({
        content: 'Este ticket ya fue reclamado o cerrado.',
      });
    }

    ticket.StaffAsignado = user.id;
    await ticket.save();

    const originalContainer = message.components[0];

    const sectionComponent = originalContainer.components.find((c) => c.type === 9);
    const textContent = sectionComponent?.components[0]?.content || '';

    const galleryComponent = originalContainer.components.find((c) => c.type === 12);
    const galleryItemBuilders = [];
    if (galleryComponent?.items?.length) {
      galleryComponent.items.forEach((item) => {
        galleryItemBuilders.push(
          new MediaGalleryItemBuilder()
            .setDescription(item.description || '')
            .setURL(item.media.url)
            .setSpoiler(item.spoiler || false)
        );
      });
    }

    const buttons = [
      new ButtonBuilder().setCustomId('CloseDR').setLabel('Cerrar').setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('ClaimDR')
        .setLabel('Reclamar')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
    ];

    const container = new ContainerBuilder()
      .setAccentColor(0x00ff00)
      .addSectionComponents((section) =>
        section
          .addTextDisplayComponents((text) => text.setContent(textContent))
          .setThumbnailAccessory((thumb) =>
            thumb.setURL(client.user.displayAvatarURL({ size: 1024, extension: 'png' }))
          )
      )
      .addSeparatorComponents((sep) => sep.setSpacing(SeparatorSpacingSize.Small).setDivider(true));

    if (galleryItemBuilders.length) {
      container.addMediaGalleryComponents((gallery) => gallery.addItems(...galleryItemBuilders));
    }

    container
      .addSeparatorComponents((sep) => sep.setSpacing(SeparatorSpacingSize.Large).setDivider(true))
      .addActionRowComponents((row) => row.addComponents(...buttons))
      .addActionRowComponents((row) =>
        row.addComponents(
          new UserSelectMenuBuilder()
            .setCustomId('DRTicketAddUser')
            .setPlaceholder('Agregar usuario al ticket')
            .setMinValues(1)
            .setMaxValues(10)
        )
      );

    await message.edit({ components: [container] });

    await interaction.editReply({
      content: 'Has reclamado este ticket.',
    });
  },
};
