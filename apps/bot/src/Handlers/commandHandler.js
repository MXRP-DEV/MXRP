import { REST, Routes, Collection } from 'discord.js';
import { pathToFileURL } from 'node:url';
import { LoadFiles } from '../Functions/FileLoader.js';
import { logger } from '../Functions/Logger.js';

export async function LoadCommands(client) {
  client.commands = new Collection();
  client.subCommands = new Collection();

  try {
    const files = await LoadFiles('src/Commands');

    if (files.length === 0) return;

    const commandsToRegister = [];
    const loadPromises = files.map((file) => loadCommand(client, file));
    const results = await Promise.allSettled(loadPromises);

    let successful = 0;

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value.status) {
        successful++;
        if (result.value.data) {
          commandsToRegister.push(result.value.data);
        }
      }
    }

    logger.info(`[Comandos] ✅ Cargados ${successful}`);

    await updateApplicationCommands(client, commandsToRegister);
  } catch (err) {
    logger.error('Error crítico al cargar los comandos:', err);
  }
}

async function loadCommand(client, file) {
  try {
    const commandModule = await import(pathToFileURL(file).href);
    const command = commandModule.default || commandModule;

    if (!command.data && !command.subCommand) {
      logger.warn(`El comando en ${file} no tiene 'data' ni es 'subCommand'.`);
      return { status: false };
    }

    if (command.subCommand) {
      return handleSubCommand(client, command);
    }

    if (command.data && command.execute) {
      client.commands.set(command.data.name, command);
      return { status: true, data: command.data.toJSON() };
    }

    return { status: false };
  } catch (error) {
    logger.error(`Error cargando comando desde ${file}:`, error);
    return { status: false };
  }
}

function handleSubCommand(client, command) {
  const parts = command.subCommand.split('.');

  if (parts.length === 2) {
    const [commandName, subCommandName] = parts;
    if (!client.subCommands.has(commandName)) {
      client.subCommands.set(commandName, new Collection());
    }
    client.subCommands.get(commandName).set(subCommandName, command);
    return { status: true };
  }

  return { status: false };
}

async function updateApplicationCommands(client, commands) {
  const rest = new REST().setToken(process.env.DISCORD_TOKEN);
  const guildId = process.env.GUILD_ID;
  const clientId = process.env.CLIENT_ID;

  if (!clientId) {
    logger.error('❌ CLIENT_ID no está definido en el archivo .env');
    return;
  }

  try {
    const route = guildId
      ? Routes.applicationGuildCommands(clientId, guildId)
      : Routes.applicationCommands(clientId);

    await rest.put(route, { body: commands });
    logger.info(`[API] ✅ Comandos registrados en ${guildId ? 'Servidor' : 'Global'}`);
  } catch (error) {
    logger.error('❌ Error al registrar comandos en la API:', error);
  }
}
