import { Events } from 'discord.js';
import { logger } from '../../../Functions/Logger.js';

export default {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (!interaction.isButton()) return;

    let button = client.buttons.get(interaction.customId);

    if (!button && interaction.customId.includes(':')) {
      const dynamicId = interaction.customId.split(':')[0];
      button = client.buttons.get(dynamicId);
    }

    if (!button) {
      logger.debug(`Botón sin handler: ${interaction.customId}`);
      return;
    }

    try {
      await button.execute(interaction, client);
    } catch (error) {
      logger.error(`Error al ejecutar botón ${interaction.customId}:`, error);
      const reply = { content: 'Error al procesar el botón.', flags: 'Ephemeral' };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply);
      } else {
        await interaction.reply(reply);
      }
    }
  },
};
