import { UserSelectMenuInteraction } from 'discord.js';
import { CacheManager } from '#utils/CacheManager.js';

export default {
  customId: 'DRTicketAddUser',

  /**
   * @param {UserSelectMenuInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, channel, member, values } = interaction;

    // Verificar permisos
    const setup = await CacheManager.getTicketSetupDR(guild.id);

    if (!setup) {
      return interaction.reply({
        content: '❌ Sistema no configurado.',
        flags: 'Ephemeral',
      });
    }

    const hasPermission =
      member.roles.cache.has(setup.SpInterno) ||
      member.roles.cache.has(setup.Supervisor) ||
      member.roles.cache.has(setup.SupGeneral) ||
      member.permissions.has('Administrator');

    if (!hasPermission) {
      return interaction.reply({
        content: '❌ No tienes permisos para agregar usuarios.',
        flags: 'Ephemeral',
      });
    }

    // Dar permisos a todos los usuarios seleccionados
    const addedUsers = [];
    const alreadyHasAccess = [];
    const addedUserIds = [];

    for (const userId of values) {
      const targetUser = await guild.members.fetch(userId).catch(() => null);
      if (!targetUser) continue;

      // Verificar si ya tiene acceso
      if (channel.permissionsFor(targetUser.id).has('ViewChannel')) {
        alreadyHasAccess.push(targetUser.user.tag);
        continue;
      }

      // Dar permisos al usuario
      await channel.permissionOverwrites.edit(targetUser.id, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true,
      });

      addedUsers.push(targetUser.user.tag);
      addedUserIds.push(targetUser.id);
    }

    let responseMessage = '';
    if (addedUsers.length > 0) {
      responseMessage += `✅ Usuarios agregados: ${addedUsers.join(', ')}\n`;
    }
    if (alreadyHasAccess.length > 0) {
      responseMessage += `ℹ️ Ya tenían acceso: ${alreadyHasAccess.join(', ')}`;
    }

    await interaction.reply({
      content: responseMessage || '❌ No se pudo agregar ningún usuario.',
      flags: 'Ephemeral',
    });

    // Notificar en el canal si se agregaron usuarios
    if (addedUsers.length > 0) {
      await channel.send({
        content: `👥 **Usuarios agregados** por ${member}: ${addedUserIds.map((id) => `<@${id}>`).join(', ')}`,
      });
    }
  },
};
