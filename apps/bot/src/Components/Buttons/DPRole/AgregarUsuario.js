import { ButtonInteraction } from 'discord.js';
import { StringSelectMenuBuilder, ActionRowBuilder } from 'discord.js';
import { CacheManager } from '#utils/CacheManager.js';

export default {
  customId: 'agregar_usuario_dr',

  /**
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, channel, member } = interaction;

    // Verificar permisos (solo staff puede agregar usuarios)
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
        content: '❌ No tienes permisos para agregar usuarios a este ticket.',
        flags: 'Ephemeral',
      });
    }

    // Obtener usuarios del servidor
    const members = await guild.members.fetch();
    const staffMembers = members.filter(m => 
      m.roles.cache.has(setup.SpInterno) ||
      m.roles.cache.has(setup.Supervisor) ||
      m.roles.cache.has(setup.SupGeneral) ||
      m.permissions.has('Administrator')
    );

    // Crear select menu para agregar usuarios
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('agregar_usuario_select_dr')
      .setPlaceholder('🔎 Selecciona un usuario para agregar')
      .setMaxValues(1);

    // Agregar opciones de usuarios
    staffMembers.forEach(member => {
      if (member.id !== interaction.user.id) { // No mostrar al que ejecuta el comando
        selectMenu.addOptions({
          label: member.user.tag,
          description: `Agregar ${member.user.tag} al ticket`,
          value: member.id,
          emoji: '👤',
        });
      }
    });

    const row = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.reply({
      content: '👥 **Selecciona un usuario para agregar al ticket:**',
      components: [row],
      flags: 'Ephemeral',
    });
  },
};
