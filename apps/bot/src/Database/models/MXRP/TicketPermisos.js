import { Schema, model } from 'mongoose';

const PermisosSchema = new Schema({
  GuildId: { type: String, required: true, unique: true },

  // Administración
  Comite: { type: String },
  Administrador: { type: String },
  OficinaAdm: { type: String },
  HeadStaff: { type: String },
  RH: { type: String },
  AI: { type: String }, // Mantenemos AI por si acaso, aunque la DB tiene AsuntosInternos
  AsuntosInternos: { type: String },

  // Desarrollo
  Developer: { type: String },
  GestorTI: { type: String },

  // Moderación
  Moderador: { type: String },
  SoporteTecnico: { type: String },
  CommunitySupport: { type: String },
  CommunityManager: { type: String },
  DirectorSoporte: { type: String },

  // Vinculacion
  Vinculacion: { type: String },
  DRVinculacion: { type: String },

  // Finanzas
  Tesoreria: { type: String },
  AuditorTesoreria: { type: String },

  // Diseño
  Diseñador: { type: String },
  HeadDiseñador: { type: String },

  // Otros Staff
  INE: { type: String },
  SupervisorFaccionario: { type: String },
  DirectorSoporte: { type: String },
  AsuntosInternos: { type: String },
});

export default model('TicketPermisos', PermisosSchema);
