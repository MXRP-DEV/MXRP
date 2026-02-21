import { Events } from 'discord.js';
import { logger } from '../../../Functions/Logger.js';

export default {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (!interaction.isModalSubmit()) return;

    const modal = client.modals.get(interaction.customId);

    if (!modal) {
      logger.debug(`Modal sin handler: ${interaction.customId}`);
      return;
    }

    try {
      await modal.execute(interaction, client);
    } catch (error) {
      logger.error(`Error al ejecutar modal ${interaction.customId}:`, error);
      const reply = { content: 'Error al procesar el modal.', flags: 'Ephemeral' };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply);
      } else {
        await interaction.reply(reply);
      }
    }
  },
};
