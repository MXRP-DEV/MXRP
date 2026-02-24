import { Schema, model } from 'mongoose';

const ApelacionWIPDI = new Schema({
  GuildId: { type: String, required: true, unique: true },
  CanalId: { type: String, required: true },
  PermisoRoleId: { type: String, required: true },
});

export default model('ApelacionWIPDI', ApelacionWIPDI);
