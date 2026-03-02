import {
  ButtonInteraction,
  ButtonBuilder,
  ButtonStyle,
  MediaGalleryItemBuilder,
  ContainerBuilder,
  SeparatorSpacingSize,
  UserSelectMenuBuilder,
  PermissionsBitField,
} from 'discord.js';
import TicketUserMXRP from '#database/models/MXRP/TicketUserMXRP.js';
import { CacheManager } from '#utils/CacheManager.js';
import { getCategoryRoles } from '#utils/MXRP/permissions.js';

export default {
  customId: 'ClaimMXRP',

  /**
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply({ flags: 'Ephemeral' });

    const { guild, member, user, channel, message } = interaction;

    const setup = await CacheManager.getTicketSetupMXRP(guild.id);
    const perms = await CacheManager.getTicketPermisosMXRP(guild.id);

    if (!setup || !perms) {
      return interaction.editReply({ content: 'Configuración no encontrada.' });
    }

    // Obtener todos los roles de TicketPermisos
    const allStaffRoles = Object.values(perms)
      .filter((val) => typeof val === 'string' && val.length > 15) // Filtrar solo IDs de roles válidos
      .filter((value, index, self) => self.indexOf(value) === index); // Eliminar duplicados

    // Verificar si el usuario tiene permiso de Administrador o alguno de los roles de staff
    const isAdmin = member.permissions.has(PermissionsBitField.Flags.Administrator);
    const hasStaffRole = member.roles.cache.hasAny(...allStaffRoles);

    if (!isAdmin && !hasStaffRole) {
      return interaction.editReply({
        content: 'No tienes permisos para reclamar tickets.',
      });
    }

    const ticket = await TicketUserMXRP.findOne({ ChannelId: channel.id });
    if (!ticket || ticket.Estado !== 'abierto' || ticket.StaffAsignado) {
      return interaction.editReply({
        content: 'Este ticket ya fue reclamado o cerrado.',
      });
    }

    // Verificar permisos específicos de la categoría si se desea (opcional, pero pedido general)
    // Para simplificar según la instrucción: "los roles que pueden Reclamar o Cerrar son los roles que estan en TicketPermisos.js"
    // Ya validamos hasStaffRole arriba con TODOS los roles del schema.

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
        .setCustomId('CloseMXRP')
        .setLabel('Cerrar')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('🔐')
        .setDisabled(false),

      new ButtonBuilder()
        .setCustomId('ClaimMXRP')
        .setLabel('Reclamar')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('✍🏻')
        .setDisabled(true),
    ];

    const container = new ContainerBuilder()
      .setAccentColor(0x44ff44)
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
            .setCustomId('MXRPTicketAddUser')
            .setPlaceholder('👥 Agregar usuario al ticket')
            .setMinValues(1)
            .setMaxValues(10)
        )
      )
      .addSeparatorComponents((sep) => sep.setSpacing(SeparatorSpacingSize.Large).setDivider(true));

    await message.edit({ components: [container] });

    await interaction.editReply({
      content: 'Has reclamado este ticket.',
    });
  },
};
