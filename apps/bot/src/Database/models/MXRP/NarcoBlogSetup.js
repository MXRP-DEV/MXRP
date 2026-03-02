import mongoose from 'mongoose';

const NarcoBlogSetupSchema = new mongoose.Schema({
  GuildId: { type: String, required: true, unique: true },
  RegistroId: { type: String, required: true },
  NotifyId: { type: String, required: true },
});

export default mongoose.model('NarcoBlogSetup', NarcoBlogSetupSchema);
