import { Schema, model } from 'mongoose';

const TicketSetupDR = new Schema({
  GuildId: { type: String, required: true, unique: true },

  // Canales
  PanelId: { type: String, required: true },
  LogsId: { type: String, required: true },

  // Categorías
  Unbans: { type: String, required: true },
  Reportes: { type: String, required: true },
  Otros: { type: String, required: true },

  // Roles
  SpInterno: { type: String, required: true },
  Supervisor: { type: String, required: true },
  SupGeneral: { type: String, required: true },
});

export default model('DRole', TicketSetupDR);
