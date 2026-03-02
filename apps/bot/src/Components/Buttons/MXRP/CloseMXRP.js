import {
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  LabelBuilder,
  PermissionsBitField,
} from 'discord.js';
import TicketUserMXRP from '#database/models/MXRP/TicketUserMXRP.js';
import { CacheManager } from '#utils/CacheManager.js';

export default {
  customId: 'CloseMXRP',

  /**
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { channel, member, guild } = interaction;

    const perms = await CacheManager.getTicketPermisosMXRP(guild.id);
    if (!perms) {
      return interaction.reply({
        content: 'No se encontraron permisos configurados.',
        flags: 'Ephemeral',
      });
    }

    // Obtener todos los roles de TicketPermisos
    const allStaffRoles = Object.values(perms)
      .filter((val) => typeof val === 'string' && val.length > 15)
      .filter((value, index, self) => self.indexOf(value) === index);

    // Verificar permisos: Admin o Rol de Staff
    const isAdmin = member.permissions.has(PermissionsBitField.Flags.Administrator);
    const hasStaffRole = member.roles.cache.hasAny(...allStaffRoles);

    if (!isAdmin && !hasStaffRole) {
      return interaction.reply({
        content: 'No tienes permisos para cerrar tickets.',
        flags: 'Ephemeral',
      });
    }

    const ticket = await TicketUserMXRP.findOne({ ChannelId: channel.id });

    if (!ticket || ticket.Estado !== 'abierto') {
      return interaction.reply({
        content: 'Este ticket no es válido o ya fue cerrado.',
        flags: 'Ephemeral',
      });
    }

    if (!ticket.StaffAsignado) {
      return interaction.reply({
        content: 'No se puede cerrar un ticket sin reclamar primero.',
        flags: 'Ephemeral',
      });
    }

    const Modal = new ModalBuilder()
      .setCustomId('CierreMXRP')
      .setTitle('Cierre de Ticket')
      .addLabelComponents(
        new LabelBuilder()
          .setLabel('Razón del cierre')
          .setTextInputComponent(
            new TextInputBuilder()
              .setCustomId('Razon')
              .setPlaceholder('Ingresa la razón del cierre')
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(true)
              .setMinLength(10)
              .setMaxLength(500)
          )
      );

    await interaction.showModal(Modal);
  },
};
