import mongoose from 'mongoose';
import { logger } from '../Functions/Logger.js';

class DatabaseManager {
  constructor() {
    this.isConnected = false;
    this.connectionAttempts = 0;
    this.maxRetries = 5;
    this.retryDelay = 5000;
  }

  async connect() {
    if (this.isConnected) {
      logger.warn('[Database] Ya existe una conexión activa');
      return;
    }

    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      logger.error('[Database] ❌ MONGO_URI no está definido en .env');
      throw new Error('MONGO_URI is required');
    }

    await this.attemptConnection(mongoUri);
  }

  async attemptConnection(uri) {
    try {
      this.connectionAttempts++;

      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      this.isConnected = true;
      this.connectionAttempts = 0;

      logger.info('[Database] ✅ Conectado a MongoDB');

      this.setupEventListeners();
    } catch (error) {
      logger.error(`[Database] ❌ Error de conexión (intento ${this.connectionAttempts}/${this.maxRetries}):`, error.message);

      if (this.connectionAttempts < this.maxRetries) {
        logger.info(`[Database] 🔄 Reintentando en ${this.retryDelay / 1000}s...`);
        await this.delay(this.retryDelay);
        await this.attemptConnection(uri);
      } else {
        logger.error('[Database] ❌ Máximo de reintentos alcanzado. No se pudo conectar a MongoDB');
        throw error;
      }
    }
  }

  setupEventListeners() {
    mongoose.connection.on('connected', () => {
      this.isConnected = true;
      logger.info('[Database] 🔗 Conexión establecida');
    });

    mongoose.connection.on('disconnected', () => {
      this.isConnected = false;
      logger.warn('[Database] ⚠️ Desconectado de MongoDB');
    });

    mongoose.connection.on('error', (error) => {
      logger.error('[Database] ❌ Error en la conexión:', error.message);
    });

    mongoose.connection.on('reconnected', () => {
      this.isConnected = true;
      logger.info('[Database] ✅ Reconectado a MongoDB');
    });

    process.on('SIGINT', async () => {
      await this.disconnect();
      process.exit(0);
    });
  }

  async disconnect() {
    if (!this.isConnected) {
      logger.warn('[Database] No hay conexión activa para cerrar');
      return;
    }

    try {
      await mongoose.connection.close();
      this.isConnected = false;
      logger.info('[Database] 👋 Desconectado de MongoDB');
    } catch (error) {
      logger.error('[Database] ❌ Error al desconectar:', error.message);
      throw error;
    }
  }

  getStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
    };
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const databaseManager = new DatabaseManager();
