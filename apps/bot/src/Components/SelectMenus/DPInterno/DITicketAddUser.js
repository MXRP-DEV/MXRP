import { PermissionFlagsBits, UserSelectMenuInteraction } from 'discord.js';
import TicketSetupDI from '#database/models/DPInterno/TicketSetupDI.js';

export default {
  customId: 'DITicketAddUser',

  /**
   * @param {UserSelectMenuInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, values, channel, member } = interaction;

    await interaction.deferReply({ flags: 'Ephemeral' });

    const ticketSetup = await TicketSetupDI.findOne({ GuildId: guild.id });

    if (!ticketSetup) {
      return interaction.editReply({
        content: '❌ El sistema de tickets no está configurado.',
      });
    }

    const hasPermission =
      member.roles.cache.has(ticketSetup.AsuntosInternos) || member.roles.cache.has(ticketSetup.RH);

    if (!hasPermission) {
      return interaction.editReply({
        content:
          '❌ No tienes permisos para gestionar usuarios en este ticket. Solo los roles de Asuntos Internos y RH pueden realizar esta acción.',
      });
    }

    const addedUsers = [];
    const removedUsers = [];
    const failedUsers = [];

    for (const userId of values) {
      try {
        const existingPermissions = channel.permissionOverwrites.cache.get(userId);

        if (existingPermissions && existingPermissions.allow.has(PermissionFlagsBits.ViewChannel)) {
          await channel.permissionOverwrites.delete(userId);
          removedUsers.push(userId);
        } else {
          await channel.permissionOverwrites.edit(userId, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
          });
          addedUsers.push(userId);
        }
      } catch {
        failedUsers.push(userId);
      }
    }

    let content = '';

    if (addedUsers.length > 0) {
      const mentions = addedUsers.map((id) => `<@${id}>`).join(', ');
      content += `✅ Usuarios agregados al ticket: ${mentions}\n`;
    }

    if (removedUsers.length > 0) {
      const mentions = removedUsers.map((id) => `<@${id}>`).join(', ');
      content += `🗑️ Usuarios removidos del ticket: ${mentions}\n`;
    }

    if (failedUsers.length > 0) {
      const mentions = failedUsers.map((id) => `<@${id}>`).join(', ');
      content += `❌ No se pudieron procesar: ${mentions}`;
    }

    await interaction.editReply({ content: content.trim() || 'No se realizaron cambios.' });
  },
};
