import { PermissionFlagsBits, UserSelectMenuInteraction } from 'discord.js';
import { CacheManager } from '#utils/CacheManager.js';

export default {
  customId: 'VATicketAddUser',

  /**
   * @param {UserSelectMenuInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, values, channel, member } = interaction;

    await interaction.deferReply({ flags: 'Ephemeral' });

    const ticketSetup = await CacheManager.getTicketSetupVA(guild.id);

    if (!ticketSetup) {
      return interaction.editReply({
        content: '❌ El sistema de tickets no está configurado.',
      });
    }

    const hasPermission =
      member.roles.cache.has(ticketSetup.ClaimRole1) ||
      member.roles.cache.has(ticketSetup.ClaimRole2) ||
      member.roles.cache.has(ticketSetup.ClaimRole3) ||
      member.roles.cache.has(ticketSetup.ClaimRole4);

    if (!hasPermission) {
      return interaction.editReply({
        content:
          '❌ No tienes permisos para gestionar usuarios en este ticket. Solo los roles asignados a las categorías pueden realizar esta acción.',
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
