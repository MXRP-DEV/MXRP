import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ApplicationIntegrationType,
  ChannelType,
} from 'discord.js';
import { COMMAND_SCOPES } from '#config/guilds.js';

export default {
  scope: COMMAND_SCOPES.MXRP,
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
        .addChannelOption((option) =>
          option
            .setName('panelvip')
            .setDescription('Configure donde se enviara el panel VIP')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName('logs')
            .setDescription('Canal donde se enviarán los logs de tickets')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('periodico')
        .setDescription('Configurar sistema de periódico')
        .addChannelOption((option) =>
          option
            .setName('canal')
            .setDescription('Canal donde se enviarán las noticias')
            .addChannelTypes(ChannelType.GuildAnnouncement)
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName('rol')
            .setDescription('Rol de periodista (quien puede publicar)')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('narcoblog')
        .setDescription('Configurar sistema de NarcoBlog')
        .addChannelOption((option) =>
          option
            .setName('registro')
            .setDescription('Canal de logs internos (con ID de usuario)')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName('notificar')
            .setDescription('Canal público de notificaciones')
            .addChannelTypes(ChannelType.GuildAnnouncement)
            .setRequired(true)
        )
    ),
};
