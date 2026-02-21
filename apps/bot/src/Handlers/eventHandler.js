import { pathToFileURL } from 'node:url';
import { LoadFiles } from '../Functions/FileLoader.js';
import { logger } from '../Functions/Logger.js';

export async function LoadEvents(client) {
  client.events = new Map();

  try {
    const files = await LoadFiles('src/Events');

    if (files.length === 0) return;

    const loadPromises = files.map((file) => loadEvent(client, file));
    await Promise.all(loadPromises);

    logger.info(`[Eventos] ✅ Cargados ${files.length}`);
  } catch (error) {
    logger.error('Error crítico al cargar los eventos:', error);
  }
}

async function loadEvent(client, file) {
  try {
    const eventModule = await import(pathToFileURL(file).href);
    const event = eventModule.default || eventModule;

    if (!event.name || !event.execute) {
      return;
    }

    const execute = (...args) => event.execute(...args, client);

    if (event.once) {
      client.once(event.name, execute);
    } else {
      client.on(event.name, execute);
    }

    client.events.set(event.name, execute);
  } catch (error) {
    logger.error(`Error cargando evento desde ${file}:`, error);
  }
}
