import { SlashCommandBuilder, ApplicationIntegrationType, PermissionFlagsBits } from 'discord.js';
import { COMMAND_SCOPES } from '#config/guilds.js';

export default {
  scope: COMMAND_SCOPES.MXRPVA,
  data: new SlashCommandBuilder()
    .setName('informes')
    .setDescription('🔍 Envía tu informe semanal')
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .addSubcommand((sub) => sub.setName('gp1').setDescription('Enviar informe GP1'))
    .addSubcommand((sub) => sub.setName('gp2').setDescription('Enviar informe GP2')),
};
