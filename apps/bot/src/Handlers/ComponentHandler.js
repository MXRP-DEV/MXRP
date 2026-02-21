import { Collection } from 'discord.js';
import { pathToFileURL } from 'node:url';
import { LoadFiles } from '../Functions/FileLoader.js';
import { logger } from '../Functions/Logger.js';

export async function LoadComponents(client) {
  client.buttons = new Collection();
  client.modals = new Collection();
  client.selectMenus = new Collection();

  const results = await Promise.all([
    loadComponentType(client, 'src/Components/Buttons', client.buttons, 'Botones'),
    loadComponentType(client, 'src/Components/Modals', client.modals, 'Modales'),
    loadComponentType(client, 'src/Components/SelectMenus', client.selectMenus, 'Menús'),
  ]);

  const total = results.reduce((acc, curr) => acc + (curr || 0), 0);
  logger.info(`[Componentes] ✅ Cargados ${total}`);
}

async function loadComponentType(client, path, collection, typeName) {
  try {
    const files = await LoadFiles(path);
    if (files.length === 0) return 0;

    let loadedCount = 0;
    const loadPromises = files.map(async (file) => {
      try {
        const componentModule = await import(pathToFileURL(file).href);
        const component = componentModule.default || componentModule;

        if (component.customId && component.execute) {
          collection.set(component.customId, component);
          loadedCount++;
        }
      } catch (error) {
        logger.error(`Error ${typeName} ${file}:`, error);
      }
    });

    await Promise.all(loadPromises);
    return loadedCount;
  } catch (error) {
    return 0;
  }
}
