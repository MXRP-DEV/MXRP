import { Schema, model } from 'mongoose';

const TicketSetupVA = new Schema({
  GuildId: { type: String, required: true },
  PanelId: { type: String },
  LogsId: { type: String },

  // Categorías
  Aclaraciones: { type: String },
  ApelarBans: { type: String },
  Reportes: { type: String },
  ReportesVA: { type: String },
  VIP: { type: String },

  // Roles de claim
  ClaimRole1: { type: String },
  ClaimRole2: { type: String },
  ClaimRole3: { type: String },
  ClaimRole4: { type: String },

  // Rol cuando el ticket está abierto
  OpenTicketRole: { type: String },

  // Roles VIP
  VipRole: { type: String },
  PartnerRole: { type: String },
  InversorRole: { type: String },
});

export default model('TicketSetupVA', TicketSetupVA);
