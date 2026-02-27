import { ButtonInteraction, ButtonBuilder, ButtonStyle, MediaGalleryItemBuilder } from 'discord.js';
import TicketUserDI from '#database/models/DPInterno/TicketUserDI.js';
import { buildTicketContainer } from '#utils/buildTicketContainer.js';
import { CacheManager } from '#utils/CacheManager.js';

export default {
  customId: 'ClaimDI',
  /**
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply({ flags: 'Ephemeral' });

    const { guild, member, user, channel, message } = interaction;

    const setup = await CacheManager.getTicketSetupDI(guild.id);
    if (!setup) {
      return interaction.editReply({ content: 'Configuración no encontrada.' });
    }

    if (!member.roles.cache.hasAny(setup.RH, setup.AsuntosInternos)) {
      return interaction.editReply({ content: 'No tienes permisos.' });
    }

    const ticket = await TicketUserDI.findOne({ TicketId: channel.id });
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
      new ButtonBuilder()
        .setCustomId('CloseDI')
        .setLabel('Cerrar')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('🔐')
        .setDisabled(false),

      new ButtonBuilder()
        .setCustomId('ClaimDI')
        .setLabel('Reclamar')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('✍🏻')
        .setDisabled(true),
    ];

    const container = buildTicketContainer({
      textContent,
      galleryItems: galleryItemBuilders,
      accentColor: 0x00ff00,
      buttons,
      client,
    });

    await message.edit({ components: [container] });

    await interaction.editReply({
      content: 'Has reclamado este ticket.',
    });
  },
};
