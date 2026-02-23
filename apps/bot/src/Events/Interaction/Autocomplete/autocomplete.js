import { Events } from 'discord.js';
import { logger } from '#functions/Logger.js';

export default {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (!interaction.isAutocomplete()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      if (!command.autocomplete) {
        logger.warn(`El comando ${interaction.commandName} no tiene función 'autocomplete'.`);
        return;
      }
      await command.autocomplete(interaction, client);
    } catch (error) {
      logger.error(`Error en autocompletado de ${interaction.commandName}:`, error);
    }
  },
};
