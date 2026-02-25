import { model, Schema } from 'mongoose';

const WelcomeSetupVA = new Schema({
  GuildId: String,
  Channel: String,
  Role: String,
});

export default model('WelcomeSetupVA', WelcomeSetupVA);
