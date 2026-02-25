import { Events } from 'discord.js';
import { logger } from '#functions/Logger.js';
import { getScopeForGuild } from '#config/guilds.js';

export default {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      const subCommandGroupName = interaction.options.getSubcommandGroup(false);
      const subCommandName = interaction.options.getSubcommand(false);

      if (subCommandName) {
        const subCommandKey = subCommandGroupName
          ? `${subCommandGroupName}.${subCommandName}`
          : subCommandName;

        // Obtener scope del guild actual
        const guildScope = interaction.guildId ? getScopeForGuild(interaction.guildId) : 'GLOBAL';

        // Buscar primero en subcomandos scopeados: scope.commandName
        const scopedKey = `${guildScope}.${interaction.commandName}`;
        let subCommands = client.subCommands.get(scopedKey);

        // Si no existe en scope específico, buscar en clave genérica
        if (!subCommands) {
          subCommands = client.subCommands.get(interaction.commandName);
        }

        if (subCommands) {
          const subCommand = subCommands.get(subCommandKey);

          if (subCommand && subCommand.execute) {
            await subCommand.execute(interaction, client);
            return;
          }
        }

        if (command.execute) {
          await command.execute(interaction, client);
        }
      } else {
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
