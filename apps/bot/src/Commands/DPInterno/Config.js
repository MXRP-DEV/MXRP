import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ApplicationIntegrationType,
  ChannelType,
} from 'discord.js';
import { COMMAND_SCOPES } from '#config/guilds.js';

export default {
  scope: COMMAND_SCOPES.DEV,
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Configure el bot para el servidor')
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((sub) =>
      sub
        .setName('tickets')
        .setDescription('Configura el sistema de Tickets')
        .addChannelOption((option) =>
          option
            .setName('panel')
            .setDescription('Configure donde se enviara el panel de Tickets')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName('registro')
            .setDescription('Configure donde se enviara el registro de Tickets (logs)')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName('capacitacion')
            .setDescription('Categoría para Solicitud de Capacitación')
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName('horas')
            .setDescription('Categoría para Gestión de Horas')
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName('informes')
            .setDescription('Categoría para Gestión de Informes')
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName('inactividad')
            .setDescription('Categoría para Inactividad')
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName('apelaciones')
            .setDescription('Categoría para Apelaciones')
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName('apelacionbl')
            .setDescription('Categoría para Apelación de Blacklist')
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName('otros')
            .setDescription('Categoría para Otros Tickets')
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName('ingresostaff')
            .setDescription('Categoría para Ingreso a Staff')
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName('reportestaff')
            .setDescription('Categoría para Reporte de Staff')
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName('rh')
            .setDescription('Rol de RH (Se usara para hacer ping)')
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName('asuntos')
            .setDescription('Rol de Asuntos Internos (Se usara para hacer ping)')
            .setRequired(true)
        )
    ),
};
