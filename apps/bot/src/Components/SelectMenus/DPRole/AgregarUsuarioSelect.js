import { StringSelectMenuInteraction } from 'discord.js';
import { CacheManager } from '#utils/CacheManager.js';

export default {
  customId: 'agregar_usuario_select_dr',

  /**
   * @param {StringSelectMenuInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, channel, member, values } = interaction;
    const selectedUserId = values[0];

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

    // Obtener usuario seleccionado
    const targetUser = await guild.members.fetch(selectedUserId);
    if (!targetUser) {
      return interaction.reply({
        content: '❌ Usuario no encontrado.',
        flags: 'Ephemeral',
      });
    }

    // Verificar si ya tiene acceso
    if (channel.permissionsFor(targetUser.id).has('ViewChannel')) {
      return interaction.reply({
        content: '❌ Este usuario ya tiene acceso al ticket.',
        flags: 'Ephemeral',
      });
    }

    // Dar permisos al usuario
    await channel.permissionOverwrites.edit(targetUser.id, {
      ViewChannel: true,
      SendMessages: true,
      ReadMessageHistory: true,
    });

    await interaction.update({
      content: `✅ ${targetUser.user.tag} ha sido agregado al ticket.`,
      components: [],
    });

    // Notificar en el canal
    await channel.send({
      content: `👥 **Usuario agregado:** ${targetUser} ha sido agregado al ticket por ${member}.`,
    });
  },
};
