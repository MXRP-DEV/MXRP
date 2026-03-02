import { CacheManager } from '#utils/CacheManager.js';

export async function getCategoryRoles(guildId, categoryKey) {
  const perms = await CacheManager.getTicketPermisosMXRP(guildId);
  const setup = await CacheManager.getTicketSetupMXRP(guildId);
  if (!perms || !setup) return { rolesToPing: [], rolesCanView: [] };

  const viewMap = {
    SoporteTecnico: [perms.SoporteTecnico, perms.DirectorSoporte, perms.GestorTI],
    Reportes: [perms.Moderador, perms.CommunitySupport, perms.CommunityManager],
    ReporteStaff: [perms.HeadStaff, perms.Administrador, perms.Comite],
    Quejas: [perms.CommunitySupport, perms.CommunityManager],
    CK: [perms.SupervisorFaccionario],
    Facciones: [perms.SupervisorFaccionario],
    Empresas: [perms.OficinaAdm, perms.Administrador],
    Liverys: [perms.HeadDiseñador, perms.Diseñador],
    RemoverRol: [perms.HeadStaff, perms.Administrador],
    Peticion: [perms.HeadStaff, perms.Administrador],
    Warn: [perms.HeadStaff, perms.Administrador],
    Robos: [perms.Moderador, perms.CommunitySupport],
    Hosting: [perms.Developer, perms.GestorTI],
    Compras: [perms.Tesoreria, perms.AuditorTesoreria],
    ComprasIRL: [perms.Tesoreria, perms.AuditorTesoreria],
    InePasaporte: [perms.INE],
    Otros: [perms.HeadStaff, perms.Comite],
    Disenadores: [perms.HeadDiseñador, perms.Diseñador],
    Reclamar: [perms.HeadStaff],
    ReporteAnonimo: [perms.RH, perms.AsuntosInternos, perms.Etica, perms.AI],
    SoporteVip: [perms.DirectorSoporte, perms.SoporteTecnico],
    SoportePrioritario: [perms.DirectorSoporte, perms.SoporteTecnico],
  };

  const pingMap = {
    SoporteTecnico: [perms.SoporteTecnico, perms.DirectorSoporte, perms.GestorTI],
    Reportes: [perms.Moderador, perms.CommunitySupport],
    ReporteStaff: [perms.HeadStaff, perms.Administrador],
    Quejas: [perms.CommunitySupport],
    CK: [perms.SupervisorFaccionario],
    Facciones: [perms.SupervisorFaccionario],
    Empresas: [perms.OficinaAdm],
    Liverys: [perms.HeadDiseñador],
    RemoverRol: [perms.HeadStaff],
    Peticion: [perms.HeadStaff],
    Warn: [perms.HeadStaff],
    Robos: [perms.Moderador],
    Hosting: [perms.Developer, perms.GestorTI],
    Compras: [perms.Tesoreria],
    ComprasIRL: [perms.Tesoreria],
    InePasaporte: [perms.INE],
    Otros: [perms.HeadStaff],
    Disenadores: [perms.HeadDiseñador],
    Reclamar: [perms.HeadStaff],
    ReporteAnonimo: [perms.RH, perms.AsuntosInternos, perms.Etica, perms.AI],
    SoporteVip: [perms.DirectorSoporte, perms.SoporteTecnico],
    SoportePrioritario: [perms.DirectorSoporte, perms.SoporteTecnico],
  };

  const rolesCanView = (viewMap[categoryKey] || []).filter(Boolean);
  const rolesToPing = (pingMap[categoryKey] || []).filter(Boolean);
  return { rolesToPing, rolesCanView };
}
