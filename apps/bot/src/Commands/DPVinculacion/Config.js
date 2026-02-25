import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ApplicationIntegrationType,
  ChannelType,
} from 'discord.js';
import { COMMAND_SCOPES } from '#config/guilds.js';

export default {
  scope: COMMAND_SCOPES.MXRPVA,
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
            .setName('aclaraciones')
            .setDescription('Categoría para tickets de aclaraciones')
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true)
        )
        .addChannelOption((opt) =>
          opt
            .setName('apelarbans')
            .setDescription('Categoría para apelaciones de ban')
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true)
        )
        .addChannelOption((opt) =>
          opt
            .setName('reportes')
            .setDescription('Categoría para reportes generales')
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true)
        )
        .addChannelOption((opt) =>
          opt
            .setName('reportesva')
            .setDescription('Categoría para reportes de Vinculación Administrativa')
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true)
        )
        .addChannelOption((opt) =>
          opt
            .setName('vip')
            .setDescription('Categoría para soporte VIP')
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true)
        )
        .addChannelOption((opt) =>
          opt
            .setName('logs')
            .setDescription('Canal donde se enviarán los logs de tickets')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addRoleOption((opt) =>
          opt
            .setName('clave1')
            .setDescription('Rol que puede reclamar tickets de Aclaraciones')
            .setRequired(true)
        )
        .addRoleOption((opt) =>
          opt
            .setName('clave2')
            .setDescription('Rol que puede reclamar tickets de Apelación de Ban')
            .setRequired(true)
        )
        .addRoleOption((opt) =>
          opt
            .setName('clave3')
            .setDescription('Rol que puede reclamar tickets de Reportes VA')
            .setRequired(true)
        )
        .addRoleOption((opt) =>
          opt
            .setName('clave4')
            .setDescription('Rol que puede reclamar tickets de Reportes Generales')
            .setRequired(true)
        )
        .addRoleOption((opt) =>
          opt
            .setName('abierto')
            .setDescription('Rol asignado cuando un usuario tiene un ticket abierto')
            .setRequired(true)
        )
        .addRoleOption((opt) =>
          opt.setName('vip-role').setDescription('Rol MXRP VIP').setRequired(true)
        )
        .addRoleOption((opt) =>
          opt.setName('partner').setDescription('Rol Partner').setRequired(true)
        )
        .addRoleOption((opt) =>
          opt.setName('inversor').setDescription('Rol Inversor').setRequired(true)
        )
    )

    .addSubcommandGroup((group) =>
      group
        .setName('informes')
        .setDescription('Configurar sistema de informes')

        .addSubcommand((sub) =>
          sub
            .setName('gp1')
            .setDescription('Configurar informes GP1')
            .addChannelOption((opt) =>
              opt
                .setName('canal')
                .setDescription('Canal donde se enviarán los informes GP1')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
            )
            .addRoleOption((opt) =>
              opt.setName('rol').setDescription('Rol a pingear en informes GP1').setRequired(true)
            )
        )

        .addSubcommand((sub) =>
          sub
            .setName('gp2')
            .setDescription('Configurar informes GP2')
            .addChannelOption((opt) =>
              opt
                .setName('canal')
                .setDescription('Canal donde se enviarán los informes GP2')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
            )
            .addRoleOption((opt) =>
              opt.setName('rol').setDescription('Rol a pingear en informes GP2').setRequired(true)
            )
        )

        .addSubcommand((sub) =>
          sub
            .setName('ae')
            .setDescription('Configurar informes AE')
            .addChannelOption((opt) =>
              opt
                .setName('canal')
                .setDescription('Canal donde se enviarán los informes AE')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
            )
            .addRoleOption((opt) =>
              opt.setName('rol').setDescription('Rol a pingear en informes AE').setRequired(true)
            )
        )

        .addSubcommand((sub) =>
          sub
            .setName('av')
            .setDescription('Configurar informes AV')
            .addChannelOption((opt) =>
              opt
                .setName('canal')
                .setDescription('Canal donde se enviarán los informes AV')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
            )
            .addRoleOption((opt) =>
              opt.setName('rol').setDescription('Rol a pingear en informes AV').setRequired(true)
            )
        )
    ),
};
