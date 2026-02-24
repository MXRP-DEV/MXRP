import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ApplicationIntegrationType,
  ChannelType,
} from 'discord.js';
import { COMMAND_SCOPES } from '#config/guilds.js';

export default {
  scope: COMMAND_SCOPES.MXRPDI,
  data: new SlashCommandBuilder()
    .setName('apelar')
    .setDescription('Sistema de apelaciones')
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    .addSubcommand((sub) => sub.setName('despido').setDescription('Apela un despido'))
    .addSubcommand((sub) => sub.setName('wip').setDescription('Apela un WIP'))
    .addSubcommand((sub) => sub.setName('blacklist').setDescription('Apela un blacklist')),
};
