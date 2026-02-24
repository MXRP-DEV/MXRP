import { Events } from 'discord.js';
import { logger } from '#functions/Logger.js';

export function setupAntiCrash(client) {
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 10;
  let reconnectDelay = 5000;

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('[AntiCrash] Unhandled Rejection:', reason);
    logger.error('[AntiCrash] Promise:', promise);
  });

  process.on('uncaughtException', (error) => {
    logger.error('[AntiCrash] Uncaught Exception:', error);
    logger.error('[AntiCrash] Stack:', error?.stack);
    logger.info('[AntiCrash] Intentando continuar...');
  });

  process.on('warning', (warning) => {
    logger.warn('[AntiCrash] Warning:', warning.name, warning.message);
  });

  client.on('error', (error) => {
    logger.error('[AntiCrash] Discord Client Error:', error);
  });

  client.on('shardDisconnect', (event, id) => {
    logger.warn(`[AntiCrash] Shard ${id} desconectado:`, event);

    if (reconnectAttempts < maxReconnectAttempts) {
      reconnectAttempts++;
      logger.info(
        `[AntiCrash] Intentando reconectar... (${reconnectAttempts}/${maxReconnectAttempts})`
      );

      setTimeout(() => {
        client.login(process.env.DISCORD_TOKEN).catch((err) => {
          logger.error('[AntiCrash] Error al reconectar:', err);
        });
        reconnectDelay *= 1.5;
      }, reconnectDelay);
    } else {
      logger.error('[AntiCrash] Máximo de intentos de reconexión alcanzado');
    }
  });

  client.on(Events.ClientReady, () => {
    reconnectAttempts = 0;
    reconnectDelay = 5000;
    logger.info('[AntiCrash] Bot conectado exitosamente - Contador reseteado');
  });

  client.on('shardError', (error, shardId) => {
    logger.error(`[AntiCrash] Shard ${shardId} Error:`, error);
  });

  client.on('shardReconnecting', (id) => {
    logger.info(`[AntiCrash] Shard ${id} reconectando...`);
  });

  client.on('shardResume', (id, replayedEvents) => {
    logger.info(`[AntiCrash] Shard ${id} resumido - Eventos replayed: ${replayedEvents}`);
  });

  client.ws.on('error', (error) => {
    logger.error('[AntiCrash] WebSocket Error:', error);
  });

  process.on('SIGTERM', () => {
    logger.info('[AntiCrash] SIGTERM recibido - Cerrando...');
    gracefulShutdown(client);
  });

  process.on('SIGINT', () => {
    logger.info('[AntiCrash] SIGINT recibido - Cerrando...');
    gracefulShutdown(client);
  });

  logger.info('[AntiCrash] Sistema inicializado correctamente');
}

async function gracefulShutdown(client) {
  try {
    await client.destroy();
    logger.info('[AntiCrash] Bot cerrado correctamente');
    process.exit(0);
  } catch (error) {
    logger.error('[AntiCrash] Error al cerrar:', error);
    process.exit(1);
  }
}
