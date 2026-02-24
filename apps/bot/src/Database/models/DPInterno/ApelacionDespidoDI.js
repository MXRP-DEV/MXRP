import { Schema, model } from 'mongoose';

const ApelacionDespidoDI = new Schema({
  GuildId: { type: String, required: true, unique: true },
  CanalId: { type: String, required: true },
  PermisoRoleId: { type: String, required: true },
  RHRolId: { type: String, required: true },
  MessageId: { type: String, required: false },
});

export default model('ApelacionDespidoDI', ApelacionDespidoDI);
