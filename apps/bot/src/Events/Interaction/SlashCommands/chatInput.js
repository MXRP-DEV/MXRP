import { Events } from 'discord.js';
import { logger } from '#functions/Logger.js';

export default {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      // Verificar si es un subcomando
      const subCommandName = interaction.options.getSubcommand(false);

      if (subCommandName) {
        // Buscar el subcomando
        const subCommands = client.subCommands.get(interaction.commandName);

        if (subCommands) {
          const subCommand = subCommands.get(subCommandName);

          if (subCommand && subCommand.execute) {
            await subCommand.execute(interaction, client);
            return;
          }
        }

        // Si no se encuentra el subcomando, intentar ejecutar el comando principal
        if (command.execute) {
          await command.execute(interaction, client);
        }
      } else {
        // No es un subcomando, ejecutar comando principal
        if (command.execute) {
          await command.execute(interaction, client);
        }
      }
    } catch (error) {
      logger.error(`Error al ejecutar comando ${interaction.commandName}:`, error);
      const reply = { content: 'Hubo un error al ejecutar este comando.', ephemeral: true };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply);
      } else {
        await interaction.reply(reply);
      }
    }
  },
};
