import { redisManager } from './RedisClient.js';

const DEFAULT_TTL = 300; // 5 minutos por defecto
const ROLES_TTL = 12 * 60 * 60; // 12 Horas
const CATEGORIES_TTL = 7 * 24 * 60 * 60; // 7 Días

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
      CATEGORIES_TTL
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
      CATEGORIES_TTL
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
      CATEGORIES_TTL
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
      CATEGORIES_TTL
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
      CATEGORIES_TTL
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
      CATEGORIES_TTL
    );
  }

  static async invalidateInformeSetupVA(guildId) {
    const cacheKey = `informe_setup_va:${guildId}`;
    await redisManager.del(cacheKey);
  }

  static async getTicketSetupDR(guildId) {
    const cacheKey = `ticket_setup_dr:${guildId}`;
    return redisManager.getOrSet(
      cacheKey,
      async () => {
        const TicketSetupDR = (await import('#database/models/DPRole/TicketSetupDR.js')).default;
        return await TicketSetupDR.findOne({ GuildId: guildId }).lean();
      },
      CATEGORIES_TTL
    );
  }

  static async invalidateTicketSetupDR(guildId) {
    const cacheKey = `ticket_setup_dr:${guildId}`;
    await redisManager.del(cacheKey);
  }

  static async getWarnSetupDR(guildId) {
    const cacheKey = `warn_setup_dr:${guildId}`;
    return redisManager.getOrSet(
      cacheKey,
      async () => {
        const WarnSetupDR = (await import('#database/models/DPRole/WarnSetupDR.js')).default;
        return await WarnSetupDR.findOne({ GuildId: guildId }).lean();
      },
      CATEGORIES_TTL
    );
  }

  static async invalidateWarnSetupDR(guildId) {
    const cacheKey = `warn_setup_dr:${guildId}`;
    await redisManager.del(cacheKey);
  }

  static async getFaccionSetupDR(guildId) {
    const cacheKey = `faccion_setup_dr:${guildId}`;
    return redisManager.getOrSet(
      cacheKey,
      async () => {
        const FaccionSetupDR = (await import('#database/models/DPRole/FaccionSetupDR.js')).default;
        return await FaccionSetupDR.findOne({ GuildId: guildId }).lean();
      },
      CATEGORIES_TTL
    );
  }

  static async invalidateFaccionSetupDR(guildId) {
    const cacheKey = `faccion_setup_dr:${guildId}`;
    await redisManager.del(cacheKey);
  }

  static async getTicketSetupMXRP(guildId) {
    const cacheKey = `ticket_setup_mxrp:${guildId}`;
    return redisManager.getOrSet(
      cacheKey,
      async () => {
        const TicketSetupMXRP = (await import('#database/models/MXRP/TicketSetupMXRP.js')).default;
        return await TicketSetupMXRP.findOne({ GuildId: guildId }).lean();
      },
      CATEGORIES_TTL
    );
  }

  static async invalidateTicketSetupMXRP(guildId) {
    const cacheKey = `ticket_setup_mxrp:${guildId}`;
    await redisManager.del(cacheKey);
  }

  static async getTicketPermisosMXRP(guildId) {
    const cacheKey = `ticket_permisos_mxrp:${guildId}`;
    return redisManager.getOrSet(
      cacheKey,
      async () => {
        const TicketPermisos = (await import('#database/models/MXRP/TicketPermisos.js')).default;
        return await TicketPermisos.findOne({ GuildId: guildId }).lean();
      },
      ROLES_TTL
    );
  }

  static async invalidateTicketPermisosMXRP(guildId) {
    const cacheKey = `ticket_permisos_mxrp:${guildId}`;
    await redisManager.del(cacheKey);
  }

  static async getPeriodicoSetup(guildId) {
    const cacheKey = `periodico_setup:${guildId}`;
    return redisManager.getOrSet(
      cacheKey,
      async () => {
        const PeriodicoSetup = (await import('#database/models/MXRP/PeriodicoSetup.js')).default;
        return await PeriodicoSetup.findOne({ GuildId: guildId }).lean();
      },
      CATEGORIES_TTL
    );
  }

  static async invalidatePeriodicoSetup(guildId) {
    const cacheKey = `periodico_setup:${guildId}`;
    await redisManager.del(cacheKey);
  }

  static async getNarcoBlogSetup(guildId) {
    const cacheKey = `narcoblog_setup:${guildId}`;
    return redisManager.getOrSet(
      cacheKey,
      async () => {
        const NarcoBlogSetup = (await import('#database/models/MXRP/NarcoBlogSetup.js')).default;
        return await NarcoBlogSetup.findOne({ GuildId: guildId }).lean();
      },
      CATEGORIES_TTL
    );
  }

  static async invalidateNarcoBlogSetup(guildId) {
    const cacheKey = `narcoblog_setup:${guildId}`;
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
