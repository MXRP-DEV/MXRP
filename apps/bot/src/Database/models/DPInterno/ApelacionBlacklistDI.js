import { Schema, model } from 'mongoose';

const ApelacionBlacklistDI = new Schema({
  GuildId: { type: String, required: true, unique: true },
  CanalId: { type: String, required: true },
  PermisoRoleId: { type: String, required: true },
  AsuntosRoleId: { type: String, required: true },
});

export default model('ApelacionBlacklistDI', ApelacionBlacklistDI);
