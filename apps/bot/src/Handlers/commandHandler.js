import { REST, Routes } from 'discord.js';
import { pathToFileURL } from 'node:url';
import { LoadFiles } from '#functions/FileLoader.js';
import { logger } from '#functions/Logger.js';
import { COMMAND_SCOPES, getGuildIdsForScope, GUILD_CONFIG } from '#config/guilds.js';

export async function LoadCommands(client) {
  client.commands = new Map();
  client.subCommands = new Map();

  logger.info('[Comandos] Cargando comandos...');

  try {
    const files = await LoadFiles('src/Commands');
    const commandFiles = files.filter((file) => !file.toLowerCase().endsWith('.autocomplete.js'));

    if (commandFiles.length === 0) {
      logger.warn('[Comandos] No se encontraron comandos.');
      return;
    }

    logger.info(`[Comandos] 📂 Encontrados ${commandFiles.length} archivos`);

    const commandsArray = [];
    const failedCommands = [];

    const loadPromises = commandFiles.map(async (file) => {
      try {
        const command = await loadCommand(client, file);
        if (command.status) {
          commandsArray.push(command);
        } else {
          failedCommands.push(command);
        }
        return command;
      } catch (error) {
        logger.error(`[Comandos] Error cargando ${file}:`, error);
        return { name: 'Comando Desconocido', status: false };
      }
    });

    const results = await Promise.allSettled(loadPromises);
    const successful = results.filter((r) => r.status === 'fulfilled' && r.value.status).length;
    const failed = results.length - successful;

    logger.info(`[Comandos] ✅ Cargados ${successful}/${commandFiles.length}`);
    if (failed > 0) {
      logger.warn(`[Comandos] ⚠️ Fallidos: ${failed}`);
    }

    const scopeStats = {};
    commandsArray.forEach((cmd) => {
      const env = getCommandEnvironment(cmd);
      scopeStats[env] = (scopeStats[env] || 0) + 1;
    });

    logger.debug('[Comandos] Estadísticas por scope:', scopeStats);

    await updateApplicationCommands(
      client,
      commandsArray.filter((c) => !c.subCommand)
    );
  } catch (err) {
    logger.error('[Comandos] ❌ Error crítico al cargar los comandos:', err);
  }
}

async function loadCommand(client, file) {
  try {
    const commandModule = await import(pathToFileURL(file).href);
    const command = commandModule.default || commandModule;

    if (command.subCommand) {
      return handleSubCommand(client, command);
    } else {
      return handleMainCommand(client, command);
    }
  } catch (error) {
    logger.error(`[Comandos] ❌ Error cargando ${file}:`, error);
    return { name: 'Comando Desconocido', status: false };
  }
}

function handleSubCommand(client, command) {
  const parts = command.subCommand.split('.');
  const scope = command.scope || 'GLOBAL';

  if (parts.length === 2) {
    const [commandName, subCommandName] = parts;

    // Guardar bajo clave scopeada: scope.commandName
    const scopedKey = `${scope}.${commandName}`;
    if (!client.subCommands.has(scopedKey)) {
      client.subCommands.set(scopedKey, new Map());
    }
    client.subCommands.get(scopedKey).set(subCommandName, command);

    // También guardar bajo clave genérica para compatibilidad
    if (!client.subCommands.has(commandName)) {
      client.subCommands.set(commandName, new Map());
    }
    client.subCommands.get(commandName).set(subCommandName, command);

    return {
      name: `${scopedKey}.${subCommandName}`,
      subCommand: true,
      status: true,
    };
  } else if (parts.length === 3) {
    const [commandName, groupName, subCommandName] = parts;

    // Guardar bajo clave scopeada
    const scopedKey = `${scope}.${commandName}`;
    if (!client.subCommands.has(scopedKey)) {
      client.subCommands.set(scopedKey, new Map());
    }
    const commandMap = client.subCommands.get(scopedKey);
    const fullKey = `${groupName}.${subCommandName}`;
    commandMap.set(fullKey, command);

    // También guardar bajo clave genérica
    if (!client.subCommands.has(commandName)) {
      client.subCommands.set(commandName, new Map());
    }
    client.subCommands.get(commandName).set(fullKey, command);

    return {
      name: `${scopedKey}.${fullKey}`,
      subCommand: true,
      status: true,
    };
  } else {
    logger.error(`[Comandos] ❌ Formato de subCommand inválido: ${command.subCommand}`);
    return {
      name: command.subCommand,
      subCommand: true,
      status: false,
    };
  }
}

function handleMainCommand(client, command) {
  if (!command.data) {
    return { status: false };
  }

  client.commands.set(command.data.name, command);
  return {
    ...command.data.toJSON(),
    name: command.data.name,
    subCommand: false,
    scope: command.scope || COMMAND_SCOPES.GLOBAL,
    guilds: command.guilds || null,
    status: true,
  };
}

function getCommandEnvironment(command) {
  if (command.subCommand) return 'SubCmd';
  if (command.scope) return command.scope;
  if (command.guilds && command.guilds.length > 0) return command.guilds.join(',');
  return COMMAND_SCOPES.GLOBAL;
}

async function updateApplicationCommands(client, commandsArray) {
  const rest = new REST().setToken(process.env.DISCORD_TOKEN);
  const clientId = process.env.CLIENT_ID;

  if (!clientId) {
    logger.error('[API] ❌ CLIENT_ID no está definido en .env');
    return;
  }

  logger.info('[API] 🔄 Actualizando comandos en Discord...');

  const commandsByScope = {};

  for (const cmd of commandsArray) {
    if (cmd.name === 'Comando Desconocido') continue;

    const scope = cmd.scope || COMMAND_SCOPES.GLOBAL;
    if (!commandsByScope[scope]) {
      commandsByScope[scope] = [];
    }
    commandsByScope[scope].push(cmd);
  }

  const updatePromises = Object.entries(commandsByScope).map(async ([scope, commands]) => {
    if (scope === COMMAND_SCOPES.GLOBAL) {
      const route = Routes.applicationCommands(clientId);
      try {
        await rest.put(route, { body: commands });
        logger.info(`[API] ✅ ${scope}: ${commands.length} comandos globales`);
      } catch (error) {
        logger.error(`[API] ❌ Error en comandos ${scope}:`, error);
        throw error;
      }
    } else {
      const guildIds = getGuildIdsForScope(scope);

      if (guildIds && guildIds.length > 0) {
        for (const guildId of guildIds) {
          const route = Routes.applicationGuildCommands(clientId, guildId);
          try {
            await rest.put(route, { body: commands });
            const guildInfo = Object.values(GUILD_CONFIG).find((g) => g.id === guildId);
            const guildName = guildInfo?.name || guildId;
            logger.info(`[API] ✅ ${scope} → ${guildName}: ${commands.length} comandos`);
          } catch (error) {
            logger.error(`[API] ❌ Error en guild ${guildId}:`, error);
            throw error;
          }
        }
      } else {
        logger.warn(`[API] ⚠️ No hay guild IDs configurados para scope ${scope}`);
      }
    }
  });

  const results = await Promise.allSettled(updatePromises);
  const successful = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;

  logger.info(`[API] ✅ Comandos actualizados: ${successful} exitosos, ${failed} fallidos`);

  if (failed > 0) {
    const errors = results
      .filter((r) => r.status === 'rejected')
      .map((r) => r.reason?.message || r.reason);
    logger.error('[API] ❌ Errores:', errors);
  }
}
