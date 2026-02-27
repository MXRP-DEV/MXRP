import { createClient } from 'redis';
import { logger } from '../Functions/Logger.js';

class RedisManager {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.inFlight = new Map();
  }

  async connect() {
    try {
      const url = process.env.REDIS_URL;
      const port = process.env.REDIS_PORT;
      const username = process.env.REDIS_USERNAME;
      const password = process.env.REDIS_PASSWORD;

      if (!url || !port || !password) {
        logger.warn('[Redis] ⚠️ Configuración incompleta en .env. Redis no estará disponible.');
        return;
      }

      const encodedPassword = encodeURIComponent(password);
      const auth = username
        ? `${encodeURIComponent(username)}:${encodedPassword}@`
        : `:${encodedPassword}@`;
      const redisUrl = `redis://${auth}${url}:${port}`;

      this.client = createClient({
        url: redisUrl,
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 5) {
              logger.error('[Redis] ❌ Máximo de reintentos alcanzado');
              return new Error('Max retries reached');
            }
            return Math.min(retries * 1000, 5000);
          },
        },
      });

      this.client.on('connect', () => {
        logger.info('[Redis] 🔗 Conectando...');
      });

      this.client.on('ready', () => {
        this.isConnected = true;
        logger.info('[Redis] ✅ Conectado y listo');
      });

      this.client.on('error', (error) => {
        logger.error('[Redis] ❌ Error:', error.message);
      });

      this.client.on('disconnect', () => {
        this.isConnected = false;
        logger.warn('[Redis] ⚠️ Desconectado');
      });

      this.client.on('reconnecting', () => {
        logger.info('[Redis] 🔄 Reconectando...');
      });

      await this.client.connect();
    } catch (error) {
      logger.error('[Redis] ❌ Error al inicializar:', error.message);
      this.isConnected = false;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.destroy();
      this.isConnected = false;
      logger.info('[Redis] 👋 Desconectado manualmente');
    }
  }

  async get(key) {
    if (!this.isConnected) return null;
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error(`[Redis] ❌ Error GET ${key}:`, error.message);
      return null;
    }
  }

  async set(key, value, ttlSeconds = 300) {
    if (!this.isConnected) return false;
    try {
      await this.client.setEx(key, ttlSeconds, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error(`[Redis] ❌ Error SET ${key}:`, error.message);
      return false;
    }
  }

  async del(key) {
    if (!this.isConnected) return false;
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      logger.error(`[Redis] ❌ Error DEL ${key}:`, error.message);
      return false;
    }
  }

  async exists(key) {
    if (!this.isConnected) return false;
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`[Redis] ❌ Error EXISTS ${key}:`, error.message);
      return false;
    }
  }

  async getOrSet(key, fetchFn, ttlSeconds = 300) {
    const cached = await this.get(key);
    if (cached !== null) {
      return cached;
    }

    if (this.inFlight.has(key)) {
      return this.inFlight.get(key);
    }

    const fetchPromise = (async () => {
      const value = await fetchFn();
      if (value !== null && value !== undefined) {
        await this.set(key, value, ttlSeconds);
      }
      return value;
    })();

    this.inFlight.set(key, fetchPromise);
    try {
      return await fetchPromise;
    } finally {
      this.inFlight.delete(key);
    }
  }

  getStatus() {
    return {
      isConnected: this.isConnected,
      client: this.client ? 'initialized' : 'not initialized',
    };
  }
}

export const redisManager = new RedisManager();
