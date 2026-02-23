import { Schema, model } from 'mongoose';

const TicketUserDI = new Schema(
  {
    GuildId: { type: String, required: true },
    ChannelId: { type: String, required: true },
    TicketId: { type: String, required: true },

    CreadorId: { type: String, required: true },
    Categoria: { type: String, required: true },

    StaffAsignado: { type: String, default: null },
    CerradoPor: { type: String, default: null },

    Estado: {
      type: String,
      enum: ['abierto', 'cerrado', 'inactivo'],
      default: 'abierto',
    },
  },
  { timestamps: true }
);

export default model('TicketsDI', TicketUserDI);
