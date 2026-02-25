import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
} from 'discord.js';
import TicketSetupVA from '#database/models/DPVinculacion/TicketSetupVA.js';
import { COMMAND_SCOPES } from '#config/guilds.js';

export default {
  subCommand: 'config.tickets',
  scope: COMMAND_SCOPES.MXRPVA,

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, options } = interaction;
    await interaction.deferReply({ flags: 'Ephemeral' });

    // Panel
    const PanelId = options.getChannel('panel')?.id;

    // Categorías
    const Aclaraciones = options.getChannel('aclaraciones')?.id;
    const ApelarBans = options.getChannel('apelarbans')?.id;
    const Reportes = options.getChannel('reportes')?.id;
    const ReportesVA = options.getChannel('reportesva')?.id;
    const VIP = options.getChannel('vip')?.id;

    // Logs
    const LogsId = options.getChannel('logs')?.id;

    // Roles
    const ClaimRole1 = options.getRole('clave1')?.id;
    const ClaimRole2 = options.getRole('clave2')?.id;
    const ClaimRole3 = options.getRole('clave3')?.id;
    const ClaimRole4 = options.getRole('clave4')?.id;
    const OpenTicketRole = options.getRole('abierto')?.id;

    // Roles VIP
    const VipRole = options.getRole('vip-role')?.id;
    const PartnerRole = options.getRole('partner')?.id;
    const InversorRole = options.getRole('inversor')?.id;

    let Data = await TicketSetupVA.findOne({ GuildId: guild.id });

    if (!Data) {
      Data = await TicketSetupVA.create({
        GuildId: guild.id,
        PanelId,
        LogsId,
        Aclaraciones,
        ApelarBans,
        Reportes,
        ReportesVA,
        VIP,
        ClaimRole1,
        ClaimRole2,
        ClaimRole3,
        ClaimRole4,
        OpenTicketRole,
        VipRole,
        PartnerRole,
        InversorRole,
      });
    } else {
      Data.PanelId = PanelId;
      Data.LogsId = LogsId;
      Data.Aclaraciones = Aclaraciones;
      Data.ApelarBans = ApelarBans;
      Data.Reportes = Reportes;
      Data.ReportesVA = ReportesVA;
      Data.VIP = VIP;
      Data.ClaimRole1 = ClaimRole1;
      Data.ClaimRole2 = ClaimRole2;
      Data.ClaimRole3 = ClaimRole3;
      Data.ClaimRole4 = ClaimRole4;
      Data.VipRole = VipRole;
      Data.PartnerRole = PartnerRole;
      Data.InversorRole = InversorRole;
      Data.OpenTicketRole = OpenTicketRole;
      await Data.save();
    }

    const PanelEmbed = new EmbedBuilder()
      .setTitle('🎟️ Panel VA | Soporte')
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(
        'Bienvenido al Panel de Soporte de **Vinculación Administrativa**.\n\n' +
          'Desde aquí podrás abrir un ticket para recibir apoyo del equipo correspondiente.\n' +
          'Selecciona la categoría que mejor se adapte a tu situación:'
      )
      .setColor('#E91E63')
      .addFields(
        {
          name: '🔐 Apelación de Ban',
          value:
            'Si fuiste sancionado con un **ban** y consideras que fue injusto o deseas presentar una apelación formal.',
        },
        {
          name: '📨 Aclaraciones',
          value:
            'Para resolver dudas generales, aclarar situaciones administrativas o solicitar información específica.',
        },
        {
          name: '💎 Soporte VIP',
          value:
            'Soporte exclusivo para usuarios **VIP**. Atención prioritaria para problemas relacionados con beneficios VIP.',
        },
        {
          name: '📋 Reporte General',
          value:
            'Reporta situaciones generales que no correspondan directamente a Vinculación Administrativa.',
        },
        {
          name: '🚨 Reporte VA',
          value:
            'Reporta problemas, irregularidades o conductas relacionadas directamente con **Vinculación Administrativa**.',
        }
      )
      .setFooter({ text: 'Sistema de Tickets | Vinculación Administrativa' });

    const SelectMenu = new StringSelectMenuBuilder()
      .setCustomId('PanelVA-Tickets')
      .setPlaceholder('Selecciona una categoría de Ticket')
      .addOptions([
        { label: 'Apelación de Ban', value: 'apelar_ban', emoji: '🔐' },
        { label: 'Aclaraciones', value: 'aclaraciones', emoji: '📨' },
        { label: 'Soporte VIP', value: 'vip', emoji: '💎' },
        { label: 'Reporte General', value: 'reporte', emoji: '📋' },
        { label: 'Reporte VA', value: 'reporte_va', emoji: '🚨' },
      ]);

    const Row = new ActionRowBuilder().addComponents(SelectMenu);

    const PanelChannel = guild.channels.cache.get(PanelId);

    if (!PanelChannel || !PanelChannel.isTextBased()) {
      return interaction.editReply({
        content: '❌ El canal configurado para el panel no existe o no es válido.',
        flags: 'Ephemeral',
      });
    }

    await PanelChannel.send({
      embeds: [PanelEmbed],
      components: [Row],
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
