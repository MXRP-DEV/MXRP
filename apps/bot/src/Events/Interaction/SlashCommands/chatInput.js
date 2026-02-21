import { Events } from 'discord.js';
import { logger } from '../../../Functions/Logger.js';

export default {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction, client);
    } catch (error) {
      logger.error(`Error al ejecutar comando ${interaction.commandName}:`, error);
      const reply = { content: 'Hubo un error al ejecutar este comando.', flags: 'Ephemeral' };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply);
      } else {
        await interaction.reply(reply);
      }
    }
  },
};
