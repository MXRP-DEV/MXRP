import {
  ModalSubmitInteraction,
  ChannelType,
  PermissionsBitField,
  AttachmentBuilder,
  MediaGalleryItemBuilder,
  ButtonBuilder,
  ButtonStyle,
  UserSelectMenuBuilder,
  ContainerBuilder,
  SeparatorSpacingSize,
} from 'discord.js';
import fetch from 'node-fetch';
import TicketSetupVA from '#database/models/DPVinculacion/TicketSetupVA.js';
import TicketUserVA from '#database/models/DPVinculacion/TicketUserVA.js';

export default {
  customId: 'ReporteVA',

  /**
   * @param {ModalSubmitInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, user, fields } = interaction;

    const Asunto = fields.getTextInputValue('Asunto');
    const Detalles = fields.getTextInputValue('Detalles');

    const evidenciasAttachments = fields.fields.get('Evidencias')?.attachments ?? new Map();
    const Evidencias = Array.from(evidenciasAttachments.values());

    await interaction.deferReply({ flags: 'Ephemeral' });

    const setup = await TicketSetupVA.findOne({ GuildId: guild.id });

    if (!setup) {
      return interaction.editReply({
        content: 'El sistema de tickets no está configurado.',
      });
    }

    const categoryId = setup.ReportesVA;

    if (!categoryId) {
      return interaction.editReply({
        content: 'No se encontró una categoría asignada para Reportes VA.',
      });
    }

    interaction.editReply({
      content: 'Creando ticket...',
    });

    const channelName = `🚨┋${user.username}`.toLowerCase().replace(/ /g, '-');

    const ticketChannel = await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      parent: categoryId,
      topic: `Ticket de ${user.tag} | Reporte Vinculación Administrativa`,
      permissionOverwrites: [
        { id: guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
        {
          id: user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
        {
          id: setup.ClaimRole3,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
      ],
    });

    if (setup.OpenTicketRole) {
      const member = await guild.members.fetch(user.id);
      await member.roles.add(setup.OpenTicketRole);
    }

    const textContent = `🛡️ **Reporte Vinculación Administrativa**

Estimado <@${user.id}>, un <@&${setup.ClaimRole3}> revisará tu solicitud.
**Asunto:** ${Asunto}
**Detalles:** ${Detalles}

**Información del Ticket**
• Estado: Pendiente
• Creado: <t:${Math.floor(Date.now() / 1000)}:R>`;

    const filesToSend = [];
    const galleryItems = [];

    for (const att of Evidencias) {
      try {
        const response = await fetch(att.proxyURL || att.url);
        if (!response.ok) continue;

        const buffer = Buffer.from(await response.arrayBuffer());
        filesToSend.push(new AttachmentBuilder(buffer, { name: att.name }));

        galleryItems.push(
          new MediaGalleryItemBuilder()
            .setDescription(`Evidencia subida por ${user.tag}`)
            .setURL(`attachment://${att.name}`)
        );
      } catch {}
    }

    const container = new ContainerBuilder()
      .setAccentColor(0x9b59b6)
      .addSectionComponents((section) =>
        section
          .addTextDisplayComponents((text) => text.setContent(textContent))
          .setThumbnailAccessory((thumb) =>
            thumb.setURL(client.user.displayAvatarURL({ size: 1024, extension: 'png' }))
          )
      )
      .addSeparatorComponents((sep) => sep.setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addMediaGalleryComponents((gallery) => gallery.addItems(...galleryItems))
      .addSeparatorComponents((sep) => sep.setSpacing(SeparatorSpacingSize.Large).setDivider(true))
      .addActionRowComponents((row) =>
        row.addComponents(
          new ButtonBuilder()
            .setCustomId('CloseVA')
            .setLabel('Cerrar')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🔐')
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId('ClaimVA')
            .setLabel('Reclamar')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('✍🏻')
            .setDisabled(false)
        )
      )
      .addActionRowComponents((row) =>
        row.addComponents(
          new UserSelectMenuBuilder()
            .setCustomId('VATicketAddUser')
            .setPlaceholder('👥 Agregar usuario al ticket')
            .setMinValues(1)
            .setMaxValues(10)
        )
      );

    await ticketChannel.send({
      flags: 'IsComponentsV2',
      components: [container],
      files: filesToSend.length ? filesToSend : undefined,
    });

    await TicketUserVA.create({
      GuildId: guild.id,
      ChannelId: ticketChannel.id,
      TicketId: ticketChannel.id,
      CreadorId: user.id,
      Categoria: 'ReportesVA',
    });

    await interaction.editReply({
      content: `Tu ticket ha sido creado exitosamente: ${ticketChannel}`,
    });
  },
};
