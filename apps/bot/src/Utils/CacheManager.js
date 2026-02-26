import { redisManager } from './RedisClient.js';

const DEFAULT_TTL = 300; // 5 minutos por defecto

export class CacheManager {
  static async getTicketSetupVA(guildId) {
    const cacheKey = `ticket_setup_va:${guildId}`;
    return redisManager.getOrSet(
      cacheKey,
      async () => {
        const TicketSetupVA = (await import('#database/models/DPVinculacion/TicketSetupVA.js'))
          .default;
        return await TicketSetupVA.findOne({ GuildId: guildId }).lean();
      },
      DEFAULT_TTL
    );
  }

  static async invalidateTicketSetupVA(guildId) {
    const cacheKey = `ticket_setup_va:${guildId}`;
    await redisManager.del(cacheKey);
  }

  static async getTicketSetupDI(guildId) {
    const cacheKey = `ticket_setup_di:${guildId}`;
    return redisManager.getOrSet(
      cacheKey,
      async () => {
        const TicketSetupDI = (await import('#database/models/DPInterno/TicketSetupDI.js')).default;
        return await TicketSetupDI.findOne({ GuildId: guildId }).lean();
      },
      DEFAULT_TTL
    );
  }

  static async invalidateTicketSetupDI(guildId) {
    const cacheKey = `ticket_setup_di:${guildId}`;
    await redisManager.del(cacheKey);
  }

  static async getApelacionBlacklist(guildId) {
    const cacheKey = `apelacion_bl:${guildId}`;
    return redisManager.getOrSet(
      cacheKey,
      async () => {
        const ApelacionBlacklistDI = (
          await import('#database/models/DPInterno/ApelacionBlacklistDI.js')
        ).default;
        return await ApelacionBlacklistDI.findOne({ GuildId: guildId }).lean();
      },
      DEFAULT_TTL
    );
  }

  static async invalidateApelacionBlacklist(guildId) {
    const cacheKey = `apelacion_bl:${guildId}`;
    await redisManager.del(cacheKey);
  }

  static async getApelacionDespido(guildId) {
    const cacheKey = `apelacion_despido:${guildId}`;
    return redisManager.getOrSet(
      cacheKey,
      async () => {
        const ApelacionDespidoDI = (
          await import('#database/models/DPInterno/ApelacionDespidoDI.js')
        ).default;
        return await ApelacionDespidoDI.findOne({ GuildId: guildId }).lean();
      },
      DEFAULT_TTL
    );
  }

  static async invalidateApelacionDespido(guildId) {
    const cacheKey = `apelacion_despido:${guildId}`;
    await redisManager.del(cacheKey);
  }

  static async getApelacionWIP(guildId) {
    const cacheKey = `apelacion_wip:${guildId}`;
    return redisManager.getOrSet(
      cacheKey,
      async () => {
        const ApelacionWIPDI = (await import('#database/models/DPInterno/ApelacionWIPDI.js'))
          .default;
        return await ApelacionWIPDI.findOne({ GuildId: guildId }).lean();
      },
      DEFAULT_TTL
    );
  }

  static async invalidateApelacionWIP(guildId) {
    const cacheKey = `apelacion_wip:${guildId}`;
    await redisManager.del(cacheKey);
  }

  static async getInformeSetupVA(guildId) {
    const cacheKey = `informe_setup_va:${guildId}`;
    return redisManager.getOrSet(
      cacheKey,
      async () => {
        const InformeSetupVA = (await import('#database/models/DPVinculacion/InformeSetupVA.js'))
          .default;
        return await InformeSetupVA.findOne({ GuildId: guildId }).lean();
      },
      DEFAULT_TTL
    );
  }

  static async invalidateInformeSetupVA(guildId) {
    const cacheKey = `informe_setup_va:${guildId}`;
    await redisManager.del(cacheKey);
  }

  static async clearAll() {
    if (!redisManager.isConnected) return false;
    try {
      await redisManager.client.flushAll();
      return true;
    } catch (error) {
      return false;
    }
  }
}
