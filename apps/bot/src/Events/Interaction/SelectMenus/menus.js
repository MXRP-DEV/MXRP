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

      // No responder si el error es de interacción desconocida o ya respondida
      if (error.code === 10062 || error.code === 40060) {
        return;
      }

      const reply = {
        content: 'Error al procesar el menú.',
        flags: 'Ephemeral',
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply).catch(() => {});
      } else {
        await interaction.reply(reply).catch(() => {});
      }
    }
  },
};
