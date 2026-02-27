import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ApplicationIntegrationType,
  ChannelType,
} from 'discord.js';
import { COMMAND_SCOPES } from '#config/guilds.js';

export default {
  scope: COMMAND_SCOPES.MXRPDR,
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Configuración general del sistema')
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((sub) =>
      sub
        .setName('tickets')
        .setDescription('Configurar sistema de tickets')
        .addChannelOption((option) =>
          option
            .setName('panel')
            .setDescription('Configure donde se enviara el panel de Tickets')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addChannelOption((opt) =>
          opt
            .setName('logs')
            .setDescription('Canal donde se enviarán los logs de tickets')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addChannelOption((opt) =>
          opt
            .setName('unbans')
            .setDescription('Categoria para Solicitar Un-Bans')
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true)
        )
        .addChannelOption((opt) =>
          opt
            .setName('reportes')
            .setDescription('Categoria para Reportes de Departamento de Rol')
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true)
        )
        .addChannelOption((opt) =>
          opt
            .setName('otros')
            .setDescription('Categoria para Otros')
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName('spinterno')
            .setDescription('Role relacionado a Soporte Interno de Rol')
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName('supervisor')
            .setDescription('Role relacionado a Supervisor de Rol')
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName('supgeneral')
            .setDescription('Role relacionado a Supervisor General')
            .setRequired(true)
        )
    ),
};
