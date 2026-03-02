import { Schema, model } from 'mongoose';

const ModMailSessionSchema = new Schema(
  {
    GuildId: { type: String, required: true },
    UserId: { type: String, required: true },
    ThreadId: { type: String, required: true, unique: true },
    StaffId: { type: String, required: true },
    CreatedAt: { type: Date, default: Date.now },
    Active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model('ModMailSession', ModMailSessionSchema);
