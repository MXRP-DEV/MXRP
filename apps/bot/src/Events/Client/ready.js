import { createBackupClient } from 'discord-backup-v2';
import { Events, ActivityType } from 'discord.js';
import { logger } from '#functions/Logger.js';
import { CacheManager } from '#utils/CacheManager.js';

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    logger.info(`Conectado como ${client.user.tag}`);

    // try {
    //   const cleared = await CacheManager.clearAll();
    //   if (cleared) {
    //     logger.info('🧹 [Cache] Caché de Redis limpiado correctamente al iniciar.');
    //   } else {
    //     logger.warn('⚠️ [Cache] No se pudo limpiar el caché de Redis (¿Redis desconectado?).');
    //   }
    // } catch (error) {
    //   logger.error('❌ [Cache] Error al limpiar caché en inicio:', error);
    // }

    const activities = [
      { name: 'discord.gg/mxrp', type: ActivityType.Watching },
      { name: `Version ${process.env.VERSION}`, type: ActivityType.Listening },
    ];

    setInterval(() => {
      const activity = activities[Math.floor(Math.random() * activities.length)];
      client.user.setActivity(activity.name, { type: activity.type });
    }, 10_000);

    client.backupClient = await createBackupClient({
      storage: 'mongo',
      mongoUri: process.env.MONGO_URI,
    });

    logger.info('Backup Client Ready', client.backupClient.ready);
  },
};
