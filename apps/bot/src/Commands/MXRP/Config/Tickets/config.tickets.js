import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  AttachmentBuilder,
} from 'discord.js';
import TicketSetupMXRP from '#database/models/MXRP/TicketSetupMXRP.js';
import { Assets } from '#utils/Assets/Assets.js';
import { COMMAND_SCOPES } from '#config/guilds.js';
import { CacheManager } from '#utils/CacheManager.js';

export default {
  subCommand: 'config.tickets',
  scope: COMMAND_SCOPES.MXRP,
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, options } = interaction;
    await interaction.deferReply({ flags: 'Ephemeral' });

    const PanelId = options.getChannel('panel')?.id;
    const PanelVipId = options.getChannel('panelvip')?.id;
    const LogsId = options.getChannel('logs')?.id;
    // Categorías 1x1
    const ComprasIRL = options.getChannel('comprasirl')?.id;
    const InePasaporte = options.getChannel('inepasaporte')?.id;
    const Otros = options.getChannel('otros')?.id;
    const Robos = options.getChannel('robos')?.id;
    const Reportes = options.getChannel('reportes')?.id;
    const SoporteTecnico = options.getChannel('soporte')?.id;
    const ReporteAnonimo = options.getChannel('reporteanonimo')?.id;
    const Quejas = options.getChannel('quejas')?.id;
    const Peticion = options.getChannel('peticion')?.id;
    const Services = options.getChannel('services')?.id;
    const Warn = options.getChannel('warn')?.id;
    const CK = options.getChannel('ck')?.id;
    const Facciones = options.getChannel('facciones')?.id;
    const SoporteVip = options.getChannel('soportevip')?.id;
    const SoportePrioritario = options.getChannel('soporteprioritario')?.id;
    const ReporteStaff = options.getChannel('reportestaff')?.id;
    const RemoverRol = options.getChannel('removerrol')?.id;
    const Compras = options.getChannel('compras')?.id;
    const Disenadores = options.getChannel('disenadores')?.id;
    const Reclamar = options.getChannel('reclamar')?.id;
    const Liverys = options.getChannel('liverys')?.id;
    const Empresas = options.getChannel('empresas')?.id;

    const categoriasMap = {
      ComprasIRL,
      InePasaporte,
      Otros,
      Robos,
      Reportes,
      SoporteTecnico,
      ReporteAnonimo,
      Quejas,
      Peticion,
      Services,
      Warn,
      CK,
      Facciones,
      SoporteVip,
      SoportePrioritario,
      ReporteStaff,
      RemoverRol,
      Compras,
      Disenadores,
      Reclamar,
      Liverys,
      Empresas,
    };

    const PanelChannel = guild.channels.cache.get(PanelId);
    const PanelVipChannel = guild.channels.cache.get(PanelVipId);

    if (!PanelChannel || !PanelChannel.isTextBased()) {
      return interaction.editReply({
        content: 'El canal configurado para el panel no existe o no es válido.',
        flags: 'Ephemeral',
      });
    }
    if (!PanelVipChannel || !PanelVipChannel.isTextBased()) {
      return interaction.editReply({
        content: 'El canal configurado para el panel VIP no existe o no es válido.',
        flags: 'Ephemeral',
      });
    }

    await TicketSetupMXRP.updateOne(
      { GuildId: guild.id },
      {
        $set: {
          PanelId,
          PanelVipId,
          LogId: LogsId,
          ...categoriasMap,
        },
        $setOnInsert: { GuildId: guild.id },
      },
      { upsert: true }
    );
    await CacheManager.invalidateTicketSetupMXRP(guild.id);

    // Los permisos y RolesVip se configuran en subcomandos separados para evitar límites de opciones

    const Attachment = new AttachmentBuilder(Assets.BANNERMXRP, {
      name: 'banner.png',
    });

    const generalEmbed = new EmbedBuilder()
      .setTitle('🎟️ Soporte MXRP')
      .setColor('Red')
      .setThumbnail(client.user.displayAvatarURL())
      .setImage('attachment://banner.png')
      .setDescription(
        'https://discord.com/invite/74hEJt6mxz\n\n' +
          '**SAT MX:RP**\n' +
          'En caso de que quieras realizar la creación de una empresa dentro de MX:RP, deberás realizarlo en el servidor indicado.\n\n' +
          '**SAF MX:RP**\n' +
          'Para la compra de licencias de armas dirígete al servidor correspondiente.\n\n' +
          '**SEMOVI MX:RP**\n' +
          'Para solicitar licencias de conducir usa el servidor indicado.'
      )
      .setFooter({ text: '🎟️ Soporte MXRP' });

    const generalMenu = new StringSelectMenuBuilder()
      .setCustomId('TicketMenu')
      .setPlaceholder('🔍 Selecciona un tipo de Ticket')
      .addOptions([
        {
          label: 'MXRP Bot Hosting',
          value: 'Hosting',
          description: 'Soporte o dudas relacionadas al Hosting de Bots de MXRP',
          emoji: { name: '🤖' },
        },
        {
          label: 'Reporte a Usuarios',
          value: 'ReportUser',
          description: 'Reporta a un Usuario',
          emoji: { name: '🚨' },
        },
        {
          label: 'Anonimo',
          value: 'Anonimo',
          description: 'Realiza un reporte de forma anonima\nTemas: Serios, Acoso, Corrupción, etc',
          emoji: { name: '🕵️' },
        },
        {
          label: 'Petición de rol',
          value: 'Rol_Add',
          description: 'Solicita un rol',
          emoji: { name: '🎭' },
        },
        {
          label: 'Solicitud Remoción de Warn',
          value: 'Warn',
          description: 'Solicita que te remuevan un warn',
          emoji: { name: '⚠️' },
        },
        {
          label: 'Solicitud de CK',
          value: 'CK',
          description: 'Solicita un Character Kill',
          emoji: { name: '💀' },
        },
        {
          label: 'Queja General / Preguntas',
          value: 'Quejas',
          description: 'Una pregunta o duda general',
          emoji: { name: '❓' },
        },
        {
          label: 'Reporte al Staff',
          value: 'Staff',
          description: 'Reporta a un Staff',
          emoji: { name: '🛡️' },
        },
        {
          label: 'Remoción de Rol',
          value: 'RemRol',
          description: 'Solicita que se te quite un rol',
          emoji: { name: '🔄' },
        },
        {
          label: 'Otros',
          value: 'Otros',
          description: 'Cualquier otro tema fuera de estas categorías',
          emoji: { name: '➕' },
        },
        {
          label: 'Soporte Técnico',
          value: 'Soporte',
          description: 'Para cualquier duda/sugerencia/reclamo acerca del bot',
          emoji: { name: '💻' },
        },
        {
          label: 'Diseñadores',
          value: 'Diseñadores',
          description: 'Cualquier tema relacionada a Diseñadores',
          emoji: { name: '🎨' },
        },
        {
          label: 'Reclamar Recompensas/Robux',
          value: 'Reclamar',
          description: 'Reclama recompensas de sorteos o eventos',
          emoji: { name: '🎁' },
        },
        {
          label: 'Servicios MXRP',
          value: 'Servicios',
          description: 'En caso de que desees adquirir un Servicio de MXRP',
          emoji: { name: '🌐' },
        },
        {
          label: 'Robos de MXRP',
          value: 'Rob_add',
          description: 'Robos de MXRP',
          emoji: { name: '💰' },
        },
        {
          label: 'Liverys',
          value: 'Liverys',
          description: 'Solicitud para que suban tu livery',
          emoji: { name: '🚛' },
        },
        {
          label: 'Compras',
          value: 'Compras',
          description: 'Cualquier intento de falsificación será sancionado',
          emoji: { name: '🛒' },
        },
        {
          label: 'Compras IRL',
          value: 'ComprasIRL',
          description: 'Cualquier tema relacionado a Compras con Dinero Real',
          emoji: { name: '💳' },
        },
        {
          label: 'Departamento de Rol',
          value: 'Facciones',
          description: 'Solicitud para Facciones',
          emoji: { name: '💼' },
        },
        {
          label: 'Ine',
          value: 'Ine',
          description: 'Obten soporte sobre Ine y Pasaporte',
          emoji: { name: '🪪' },
        },
        {
          label: 'Empresas',
          value: 'Empresas',
          description: 'Crea tu empresa dentro de MXRP',
          emoji: { name: '🏢' },
        },
      ])
      .setMinValues(1)
      .setMaxValues(1);

    const generalRow = new ActionRowBuilder().addComponents(generalMenu);

    await PanelChannel.send({
      embeds: [generalEmbed],
      components: [generalRow],
      files: [Attachment],
    });

    const vipEmbed = new EmbedBuilder()
      .setTitle('Soporte VIP MXRP')
      .setDescription('Bienvenido al panel de soporte VIP. Aquí recibirás atención prioritaria')
      .setColor('Red')
      .setThumbnail(client.user.displayAvatarURL())
      .setImage('attachment://banner.png')
      .setFooter({ text: '🎟️ Soporte MXRP' });

    const vipMenu = new StringSelectMenuBuilder()
      .setCustomId('TicketMenu2')
      .setPlaceholder('🔍 Selecciona un tipo de Ticket')
      .addOptions([
        {
          label: 'Soporte Prioritario',
          value: 'SoporteP',
          description: 'Solicita soporte con Urgencia',
          emoji: { name: '🔔' },
        },
        {
          label: 'Soporte Vip',
          value: 'SoporteVip',
          description: 'Solicita soporte Vip',
          emoji: { name: '🔔' },
        },
      ])
      .setMinValues(1)
      .setMaxValues(1);

    const vipRow = new ActionRowBuilder().addComponents(vipMenu);

    await PanelVipChannel.send({
      embeds: [vipEmbed],
      components: [vipRow],
      files: [Attachment],
    });

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle('✅ Sistema de Tickets Configurado')
          .setColor('Green')
          .setThumbnail(client.user.displayAvatarURL()),
      ],
    });
  },
};
