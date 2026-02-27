import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
} from 'discord.js';
import TicketSetupDI from '#database/models/DPInterno/TicketSetupDI.js';
import { COMMAND_SCOPES } from '#config/guilds.js';
import { CacheManager } from '#utils/CacheManager.js';

export default {
  subCommand: 'config.tickets',
  scope: COMMAND_SCOPES.MXRPDI,

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, options } = interaction;
    await interaction.deferReply({ flags: 'Ephemeral' });

    const PanelId = options.getChannel('panel')?.id;
    const RegistroId = options.getChannel('registro')?.id;

    const SolicitudCapacitacion = options.getChannel('capacitacion')?.id;
    const GestionHoras = options.getChannel('horas')?.id;
    const GestionInformes = options.getChannel('informes')?.id;
    const Inactividad = options.getChannel('inactividad')?.id;
    const Apelaciones = options.getChannel('apelaciones')?.id;
    const ApelacionBL = options.getChannel('apelacionbl')?.id;
    const Otros = options.getChannel('otros')?.id;
    const IngresoStaff = options.getChannel('ingresostaff')?.id;
    const ReporteStaff = options.getChannel('reportestaff')?.id;

    const RH = options.getRole('rh')?.id;
    const AsuntosInternos = options.getRole('asuntos')?.id;

    let Data = await TicketSetupDI.findOne({ GuildId: guild.id });

    if (!Data) {
      Data = await TicketSetupDI.create({
        GuildId: guild.id,
        PanelId,
        RegistroId,
        SolicitudCapacitacion,
        GestionHoras,
        GestionInformes,
        Inactividad,
        Apelaciones,
        ApelacionBL,
        Otros,
        IngresoStaff,
        ReporteStaff,
        RH,
        AsuntosInternos,
      });
    } else {
      Data.PanelId = PanelId;
      Data.RegistroId = RegistroId;
      Data.SolicitudCapacitacion = SolicitudCapacitacion;
      Data.GestionHoras = GestionHoras;
      Data.GestionInformes = GestionInformes;
      Data.Inactividad = Inactividad;
      Data.Apelaciones = Apelaciones;
      Data.ApelacionBL = ApelacionBL;
      Data.Otros = Otros;
      Data.IngresoStaff = IngresoStaff;
      Data.ReporteStaff = ReporteStaff;
      Data.RH = RH;
      Data.AsuntosInternos = AsuntosInternos;
      await Data.save();
    }
    await CacheManager.invalidateTicketSetupDI(guild.id);

    const PanelEmbed = new EmbedBuilder()
      .setTitle('📂 Panel D.I | Soporte')
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(
        'Bienvenido al Panel de Soporte del **Departamento Interno**. Aquí podrás solicitar ayuda mediante un ticket que será atendido por el equipo de **Recursos Humanos**.\n\n' +
          'Cada categoría tiene un propósito específico. Selecciona la opción que mejor se adapte a tu necesidad:'
      )
      .setColor(0xd14a78)
      .addFields(
        {
          name: '🎓 Solicitar Capacitación',
          value:
            'Si aprobaste la prueba de **Trial Mod** o **Moderador/Soporte Auxiliar**, solicita aquí tu capacitación correspondiente.',
        },
        {
          name: '🕐 Gestión de Horas',
          value:
            'Para problemas relacionados con tus horas o tickets: robo de ticket, horas no registradas, ascensos no aplicados, etc.',
        },
        {
          name: '📋 Gestión de Informes',
          value:
            'Si tienes dudas sobre tus informes, no puedes enviarlos o necesitas resolver un problema relacionado con ellos.',
        },
        {
          name: '💤 Solicitar Inactividad',
          value:
            'Si no podrás cumplir tus horas/tickets por un tiempo, solicita aquí tu periodo de inactividad.',
        },
        {
          name: '📑 Apelaciones (Despidos / WIP / Appys)',
          value:
            'Para apelar decisiones relacionadas con despidos, WIP o Appys que consideres injustas o incorrectas.',
        },
        {
          name: '❌ Apelación BL',
          value:
            'Si fuiste colocado en **Blacklist** y deseas apelar o solicitar información sobre el motivo.',
        },
        {
          name: '🔧 Otros',
          value: 'Para cualquier otra situación que no encaje en las categorías anteriores.',
        },
        {
          name: '🛠️ Ingreso Staff',
          value:
            'Solicitudes para ingresar al Staff por beneficio o procesos internos relacionados.',
        },
        {
          name: '🛡️ Reporte Staff',
          value: 'Si deseas reportar a un miembro del Staff por mala conducta o incumplimiento.',
        }
      )
      .setFooter({ text: 'Sistema de Tickets | Departamento Interno' });

    const SelectMenu = new StringSelectMenuBuilder()
      .setCustomId('PanelDI-Tickets')
      .setPlaceholder('Selecciona una categoría de Ticket')
      .addOptions([
        { label: 'Solicitar Capacitación', value: 'solicitar_capacitacion', emoji: '🎓' },
        { label: 'Gestión de Horas', value: 'gestion_horas', emoji: '🕐' },
        { label: 'Gestión de Informes', value: 'gestion_informes', emoji: '📋' },
        { label: 'Solicitar Inactividad', value: 'solicitar_inactividad', emoji: '💤' },
        { label: 'Apelaciones (Despidos / WIP / Appys)', value: 'apelaciones', emoji: '📑' },
        { label: 'Apelación BL', value: 'apelacion_bl', emoji: '❌' },
        { label: 'Otros', value: 'otros', emoji: '🔧' },
        { label: 'Ingreso Staff', value: 'ingreso_staff', emoji: '🛠️' },
        { label: 'Reporte Staff', value: 'reporte_staff', emoji: '🛡️' },
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
    });

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle('Panel de Tickets - Configurado con Éxito')
          .setThumbnail(client.user.displayAvatarURL())
          .setColor('#00ff00'),
      ],
    });
  },
};
