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
    )
    .addSubcommandGroup((option) =>
      option
        .setName('apelar')
        .setDescription('Configurar sistema de apelaciones')
        .addSubcommand((sub) =>
          sub
            .setName('despidos')
            .setDescription('Configurar sistema de apelaciones de despidos')
            .addChannelOption((option) =>
              option
                .setName('canal')
                .setDescription('Canal donde se registraran las apelaciones de despidos')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
            )
            .addRoleOption((option) =>
              option
                .setName('permiso')
                .setDescription('Rol con permiso para crear las apelaciones de despidos')
                .setRequired(true)
            )
            .addRoleOption((option) =>
              option
                .setName('rh')
                .setDescription('Rol de Recursos Humanos (Se usara para hacer ping)')
                .setRequired(true)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName('blacklist')
            .setDescription('Configurar sistema de blacklist')
            .addChannelOption((option) =>
              option
                .setName('canal')
                .setDescription('Canal donde se registraran las apelaciones de blacklist')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
            )
            .addRoleOption((option) =>
              option
                .setName('permiso')
                .setDescription('Rol con permiso para crear las apelaciones de blacklist')
                .setRequired(true)
            )
            .addRoleOption((option) =>
              option
                .setName('asuntos')
                .setDescription('Rol de Asuntos Internos (Se usara para hacer ping)')
                .setRequired(true)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName('wips')
            .setDescription('Configurar sistema de WIPs')
            .addChannelOption((option) =>
              option
                .setName('canal')
                .setDescription('Canal donde se registraran las apelaciones de WIPs')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
            )
            .addRoleOption((option) =>
              option
                .setName('permiso')
                .setDescription('Rol con permiso para crear las apelaciones de WIPs')
                .setRequired(true)
            )
        )
    ),
};
