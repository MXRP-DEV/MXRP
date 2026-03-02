import { PermissionFlagsBits, UserSelectMenuInteraction } from 'discord.js';
import { CacheManager } from '#utils/CacheManager.js';
import { getCategoryRoles } from '#utils/MXRP/permissions.js';
import TicketUserMXRP from '#database/models/MXRP/TicketUserMXRP.js';

export default {
  customId: 'MXRPTicketAddUser',
  /**
   * @param {UserSelectMenuInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, values, channel, member } = interaction;
    await interaction.deferReply({ flags: 'Ephemeral' });

    const setup = await CacheManager.getTicketSetupMXRP(guild.id);
    if (!setup) return interaction.editReply({ content: '❌ Sistema no configurado.' });

    const ticket = await TicketUserMXRP.findOne({ ChannelId: channel.id }).lean();
    if (!ticket) return interaction.editReply({ content: '❌ Ticket desconocido.' });

    const { rolesCanView } = await getCategoryRoles(guild.id, ticket.Categoria);
    const hasPermission =
      rolesCanView.some((rid) => rid && member.roles.cache.has(rid)) ||
      member.permissions.has(PermissionFlagsBits.Administrator);

    if (!hasPermission) {
      return interaction.editReply({
        content: '❌ No tienes permisos para gestionar usuarios en este ticket.',
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
      content += `✅ Usuarios agregados: ${addedUsers.map((id) => `<@${id}>`).join(', ')}\n`;
    }
    if (removedUsers.length > 0) {
      content += `🗑️ Usuarios removidos: ${removedUsers.map((id) => `<@${id}>`).join(', ')}\n`;
    }
    if (failedUsers.length > 0) {
      content += `❌ Fallidos: ${failedUsers.map((id) => `<@${id}>`).join(', ')}`;
    }
    await interaction.editReply({ content: content.trim() || 'No se realizaron cambios.' });
  },
};
