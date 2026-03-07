import { CacheManager } from '#utils/CacheManager.js';

export async function getCategoryRoles(guildId, categoryKey) {
  const perms = await CacheManager.getTicketPermisosMXRP(guildId);
  const setup = await CacheManager.getTicketSetupMXRP(guildId);
  if (!perms || !setup) return { rolesToPing: [], rolesCanView: [] };

  const viewMap = {
    SoporteTecnico: [perms.Developer, perms.GestorTI],
    Reportes: [perms.Moderador, perms.SoporteTecnico, perms.Vinculacion],
    ReporteStaff: [perms.AI, perms.Administrador, perms.RH ],
    Quejas: [perms.SoporteTecnico, perms.Moderador, perms.Vinculacion],
    CK: [perms.SupervisorFaccionario, perms.Administrador],
    Facciones: [perms.Administracion],
    Empresas: [perms.Administrador],
    Liverys: [perms.HeadDiseñador, perms.Diseñador],
    RemoverRol: [perms.Moderador, perms.SoporteTecnico],
    Peticion: [perms.Moderador, perms.SoporteTecnico],
    Warn: [perms.HeadStaff, perms.Administrador, perms.RH],
    Robos: [perms.Administrador],
    Hosting: [perms.GestorTI],
    Compras: [perms.Tesoreria, perms.AuditorTesoreria],
    ComprasIRL: [perms.Tesoreria, perms.AuditorTesoreria],
    Services: [perms.Tesoreria, perms.AuditorTesoreria],
    InePasaporte: [perms.INE],
    Otros: [perms.Moderador, perms.SoporteTecnico],
    Disenadores: [perms.HeadDiseñador, perms.Diseñador],
    Reclamar: [perms.AuditorTesoreria, perms.Tesoreria],
    ReporteAnonimo: [perms.RH, perms.AsuntosInternos, perms.AI],
    SoporteVip: [perms.Moderador, perms.SoporteTecnico, perms.Tesoreria],
    SoportePrioritario: [perms.Moderador, perms.SoporteTecnico, perms.Tesoreria],
  };

  const pingMap = {
    SoporteTecnico: [perms.Develper, perms.GestorTI],
    Reportes: [perms.Moderador, perms.SoporteTecnico],
    ReporteStaff: [perms.RH, perms.Administrador, perms.AI],
    Quejas: [perms.Moderador, perms.SoporteTecnico],
    CK: [perms.SupervisorFaccionario, perms.Administrador],
    Facciones: [perms.SupervisorFaccionario, perms.Administrador],
    Empresas: [perms.Administrador],
    Liverys: [perms.HeadDiseñador, perms.Diseñador],
    RemoverRol: [perms.Moderador, perms.SoporteTecnico],
    Peticion: [perms.Moderador, perms.SoporteTecnico],
    Warn: [perms.Administrador, perms.RH, perms.HeadStaff],
    Robos: [perms.Administrador],
    Hosting: [perms.GestorTI],
    Compras: [perms.Tesoreria],
    ComprasIRL: [perms.Tesoreria],
    Services: [perms.Tesoreria, perms.AuditorTesoreria],
    InePasaporte: [perms.INE],
    Otros: [perms.Moderador, perms.SoporteTecnico],
    Disenadores: [perms.HeadDiseñador, perms.Diseñador],
    Reclamar: [perms.AuditorTesoreria, perms.Tesoreria],
    ReporteAnonimo: [perms.RH, perms.AsuntosInternos, perms.AI],
    SoporteVip: [perms.Moderador, perms.SoporteTecnico, perms.Tesoreria],
    SoportePrioritario: [perms.Moderador, perms.SoporteTecnico, perms.Tesoreria],
  };

  const rolesCanView = (viewMap[categoryKey] || []).filter(Boolean);
  const rolesToPing = (pingMap[categoryKey] || []).filter(Boolean);
  return { rolesToPing, rolesCanView };
}
