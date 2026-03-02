import { ButtonInteraction } from 'discord.js';

export default {
  customId: 'EliminarModMailThread',
  /**
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { channel } = interaction;

    // Confirmar eliminación
    await interaction.reply({
      content: '🗑️ Eliminando hilo de ModMail en 5 segundos...',
      flags: 'Ephemeral',
    });

    setTimeout(async () => {
      try {
        await channel.delete();
      } catch (error) {
        console.error('Error al eliminar hilo:', error);
      }
    }, 5000);
  },
};
