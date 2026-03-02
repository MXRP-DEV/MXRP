import { Schema, model } from 'mongoose';

const TicketSetupMXRP = new Schema({
  GuildId: { type: String, required: true, unique: true },
  LogId: { type: String, required: true },
  PanelId: { type: String, required: true },
  PanelVipId: { type: String, required: true },

  // Categorias
  ComprasIRL: { type: String, required: true },
  InePasaporte: { type: String, required: true },
  Otros: { type: String, required: true },
  Robos: { type: String, required: true },
  Reportes: { type: String, required: true },
  SoporteTecnico: { type: String, required: true },
  ReporteAnonimo: { type: String, required: true },
  Quejas: { type: String, required: true },

  // Categorias faltantes del schema viejo
  Peticion: { type: String, required: true },
  Services: { type: String, required: true },
  Warn: { type: String, required: true },
  CK: { type: String, required: true },
  Facciones: { type: String, required: true },
  SoporteVip: { type: String, required: true },
  SoportePrioritario: { type: String, required: true },
  ReporteStaff: { type: String, required: true },
  RemoverRol: { type: String, required: true },
  Compras: { type: String, required: true },
  Disenadores: { type: String, required: true },
  Reclamar: { type: String, required: true },
  Liverys: { type: String, required: true },
  Casino: { type: String, required: true },
  Hosting: { type: String, required: true },
  Empresas: { type: String, required: true },
  SoporteVip: { type: String, required: true },

  // Roles con acceso a tickets VIP (quienes PUEDEN ABRIR)
  RolesVip: {
    MXRPPass: { type: String, required: true },
    Vip: { type: String, required: true },
    InversorMXRP: { type: String, required: true },
    ServerBooster: { type: String, required: true },
  },

  // Anonimo Channel to Send
  AnonimoChannel: { type: String, required: true },
});

export default model('TicketSetupMXRP', TicketSetupMXRP);
