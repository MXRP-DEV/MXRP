import { Schema, model } from 'mongoose';

const TicketSetupDI = new Schema({
  GuildId: { type: String, required: true },

  PanelId: { type: String },
  RegistroId: { type: String },

  // Roles
  AsuntosInternos: { type: String },
  RH: { type: String },

  // Categorías
  SolicitudCapacitacion: { type: String },
  GestionHoras: { type: String },
  GestionInformes: { type: String },
  Inactividad: { type: String },
  Apelaciones: { type: String },
  ApelacionBL: { type: String },
  Otros: { type: String },
  IngresoStaff: { type: String },
  ReporteStaff: { type: String },
});

export default model('DInterno', TicketSetupDI);
