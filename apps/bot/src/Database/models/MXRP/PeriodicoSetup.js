import { Schema, model } from 'mongoose';

const PeriodicoSetupSchema = new Schema(
  {
    GuildId: { type: String, required: true, unique: true },
    CanalNoticias: { type: String },
    RolPeriodista: { type: String },
  },
  { timestamps: true }
);

export default model('PeriodicoSetup', PeriodicoSetupSchema);
