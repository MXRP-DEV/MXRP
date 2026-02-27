import { ButtonInteraction } from 'discord.js';
import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';
import { CacheManager } from '#utils/CacheManager.js';

export default {
  customId: 'cerrar_ticket_dr',

  /**
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, channel, member } = interaction;

    // Verificar permisos (solo staff puede cerrar)
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
        content: '❌ No tienes permisos para cerrar este ticket.',
        flags: 'Ephemeral',
      });
    }

    // Mostrar modal para razón de cierre
    const modal = new ModalBuilder()
      .setCustomId('CierreTicketDR')
      .setTitle('Cerrar Ticket - DR')
      .addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId('Razon')
            .setLabel('Razón del cierre')
            .setPlaceholder('Describe por qué cierras este ticket...')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
        )
      );

    await interaction.showModal(modal);
  },
};
