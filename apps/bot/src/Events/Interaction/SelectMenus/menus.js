import { Events } from 'discord.js';
import { logger } from '../../../Functions/Logger.js';

export default {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (!interaction.isAnySelectMenu()) return;

    const menu = client.selectMenus.get(interaction.customId);

    if (!menu) {
      logger.debug(`Menú sin handler: ${interaction.customId}`);
      return;
    }

    try {
      await menu.execute(interaction, client);
    } catch (error) {
      logger.error(`Error al ejecutar menú ${interaction.customId}:`, error);
      const reply = {
        content: 'Error al procesar el menú.',
        flags: 'Ephemeral',
      };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply);
      } else {
        await interaction.reply(reply);
      }
    }
  },
};
