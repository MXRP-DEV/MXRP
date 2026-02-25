import { model, Schema } from 'mongoose';

const InformeSetupVA = new Schema({
  GuildId: String,
  GP1Channel: String,
  GP1Role: String,
  GP2Channel: String,
  GP2Role: String,
});

export default model('InformeSetupVA', InformeSetupVA);
