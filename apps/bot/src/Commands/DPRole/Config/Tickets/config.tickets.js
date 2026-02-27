import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  AttachmentBuilder,
} from 'discord.js';
import TicketSetupDR from '#database/models/DPRole/TicketSetupDR.js';
import { COMMAND_SCOPES } from '#config/guilds.js';
import { Assets } from '#utils/Assets/Assets.js';
export default {
  subCommand: 'config.tickets',
  scope: COMMAND_SCOPES.MXRPDR,

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, options } = interaction;
    await interaction.deferReply({ flags: 'Ephemeral' });

    // Canales
    const PanelId = options.getChannel('panel')?.id;
    const LogsId = options.getChannel('logs')?.id;

    // Categorías
    const Unbans = options.getChannel('unbans')?.id;
    const Reportes = options.getChannel('reportes')?.id;
    const Otros = options.getChannel('otros')?.id;

    // Roles
    const SpInterno = options.getRole('spinterno')?.id;
    const Supervisor = options.getRole('supervisor')?.id;
    const SupGeneral = options.getRole('supgeneral')?.id;

    let Data = await TicketSetupDR.findOne({ GuildId: guild.id });

    if (!Data) {
      Data = await TicketSetupDR.create({
        GuildId: guild.id,
        PanelId,
        LogsId,
        Unbans,
        Reportes,
        Otros,
        SpInterno,
        Supervisor,
        SupGeneral,
      });
    } else {
      Data.PanelId = PanelId;
      Data.LogsId = LogsId;
      Data.Unbans = Unbans;
      Data.Reportes = Reportes;
      Data.Otros = Otros;
      Data.SpInterno = SpInterno;
      Data.Supervisor = Supervisor;
      Data.SupGeneral = SupGeneral;
      await Data.save();
    }

    const Attachment = new AttachmentBuilder(Assets.BANNERMXRP, { name: 'banner.png' });

    const PanelEmbed = new EmbedBuilder()
      .setThumbnail(client.user.displayAvatarURL())
      .setTitle('🎫 SOPORTE DEPARTAMENTO DE ROL')
      .setDescription(
        '👋 Bienvenido al sistema de tickets del **Departamento de Rol**.\n\n' +
          'Aquí podrás solicitar las siguientes opciones:\n\n' +
          '• **Solicitar Un-Ban del servidor ER:LC**\n' +
          '• **Realizar reportes al Departamento de Rol**\n' +
          '• **Otros (consultas o dudas generales)**\n\n' +
          '⚠️ Usa los tickets correctamente.\n' +
          '🔸 El mal uso del sistema será sancionado.\n' +
          '🔸 Las pruebas son obligatorias para validar reportes.'
      )
      .setImage('attachment://banner.png')
      .setColor('#ff7700')
      .setFooter({ text: 'Sistema de Tickets | Departamento de Rol' });

    const SelectMenu = new StringSelectMenuBuilder()
      .setCustomId('PanelDR-Tickets')
      .setPlaceholder('🔎 Selecciona un tipo de ticket')
      .addOptions([
        {
          label: 'Solicita Un-Ban',
          description: 'Realiza una solicitud para desbaneo ERLC',
          value: 'dr_unban',
          emoji: '🎫',
        },
        {
          label: 'Reporte Departamento de Rol',
          description: 'Reportar situaciones del Departamento de Rol',
          value: 'dr_reporte',
          emoji: '🚫',
        },
        {
          label: 'Otros',
          description: 'Consultas o dudas generales',
          value: 'dr_otros',
          emoji: '➕',
        },
      ]);

    const Row = new ActionRowBuilder().addComponents(SelectMenu);

    const PanelChannel = guild.channels.cache.get(PanelId);

    if (!PanelChannel)
      return interaction.editReply({
        content: 'El canal del panel no existe.',
        flags: 'Ephemeral',
      });

    await PanelChannel.send({
      embeds: [PanelEmbed],
      components: [Row],
      files: [Attachment],
    });

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle('Panel de Tickets DR - Configurado con Éxito')
          .setThumbnail(client.user.displayAvatarURL())
          .setColor('#00ff00'),
      ],
    });
  },
};
