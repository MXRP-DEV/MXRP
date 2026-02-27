import {
  ModalSubmitInteraction,
  ChannelType,
  PermissionsBitField,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  MediaGalleryItemBuilder,
  SeparatorSpacingSize,
  AttachmentBuilder,
  UserSelectMenuBuilder,
} from 'discord.js';
import fetch from 'node-fetch';
import { CacheManager } from '#utils/CacheManager.js';
import TicketUserDR from '#database/models/DPRole/TicketUserDR.js';

export default {
  customId: 'ReporteDR',

  /**
   * @param {ModalSubmitInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, user, fields } = interaction;

    const descripcion = fields.getTextInputValue('descripcion_reporte');
    const drReportado = fields.getTextInputValue('dr_reportado');
    const razonReporte = fields.getTextInputValue('razon_reporte');
    const pruebasAttachments = fields.fields.get('pruebas_reporte')?.attachments ?? new Map();
    const Pruebas = Array.from(pruebasAttachments.values());

    await interaction.deferReply({ flags: 'Ephemeral' });

    const setup = await CacheManager.getTicketSetupDR(guild.id);

    if (!setup) {
      return interaction.editReply({
        content: 'El sistema de tickets DR no está configurado.',
      });
    }

    const categoryId = setup.Reportes;

    if (!categoryId) {
      return interaction.editReply({
        content: 'No se encontró una categoría asignada para reportes.',
      });
    }

    const category = guild.channels.cache.get(categoryId);
    if (!category || category.type !== ChannelType.GuildCategory) {
      return interaction.editReply({
        content: 'La categoría configurada no es válida.',
      });
    }

    const ticketName = `🚫┋${user.username}`.toLowerCase().replace(/ /g, '-');

    const channel = await guild.channels.create({
      name: ticketName,
      type: ChannelType.GuildText,
      parent: categoryId,
      topic: user.id,
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
          id: setup.Supervisor,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
            PermissionsBitField.Flags.ManageChannels,
          ],
        },
        {
          id: setup.SupGeneral,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
            PermissionsBitField.Flags.ManageChannels,
          ],
        },
      ],
    });

    const createdAt = Math.floor(Date.now() / 1000);

    const textContent = `🚫 **Reporte de DR**

Estimado: <@${user.id}>, un miembro de <@&${setup.Supervisor}> y <@&${setup.SupGeneral}> pronto te atenderá.

-# Tu reporte será revisado con atención.
-# Proporciona todas las pruebas necesarias.

**Información del Ticket**
• **Tipo:** Reporte de DR
• **Reportante:** ${user.tag}
• **Fecha:** <t:${createdAt}:R>

**Descripción del Reporte:**
${descripcion}

**Detalles Adicionales:**
• **DR Reportado:** ${drReportado}
• **Razón del Reporte:** ${razonReporte}

• Creado: <t:${createdAt}:R>`;

    const filesToSend = [];
    const galleryItems = [];
    const skippedFiles = [];
    const MAX_VIDEO_SIZE = 10 * 1024 * 1024;

    for (const att of Pruebas) {
      try {
        const isVideo =
          att.name?.toLowerCase().endsWith('.mp4') || att.contentType?.startsWith('video/');
        if (isVideo && att.size > MAX_VIDEO_SIZE) {
          skippedFiles.push(`${att.name} (${(att.size / 1024 / 1024).toFixed(2)}MB - máx 10MB)`);
          continue;
        }

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

    if (skippedFiles.length > 0) {
      await interaction.followUp({
        content: `⚠️ Los siguientes videos exceden el límite de 10MB y no fueron adjuntados:\n${skippedFiles.join('\n')}`,
        flags: 'Ephemeral',
      });
    }

    const container = new ContainerBuilder()
      .setAccentColor(0xff4444)
      .addSectionComponents((section) =>
        section
          .addTextDisplayComponents((text) => text.setContent(textContent))
          .setThumbnailAccessory((thumb) =>
            thumb.setURL(client.user.displayAvatarURL({ size: 1024, extension: 'png' }))
          )
      )
      .addSeparatorComponents((sep) => sep.setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addMediaGalleryComponents((gallery) => gallery.addItems(...galleryItems))
      .addActionRowComponents((row) =>
        row.addComponents(
          new ButtonBuilder()
            .setCustomId('cerrar_ticket_dr')
            .setLabel('🔒 Cerrar Ticket')
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId('reclamar_ticket_dr')
            .setLabel('✅ Reclamar Ticket')
            .setStyle(ButtonStyle.Success)
        )
      )
      .addActionRowComponents((row) =>
        row.addComponents(
          new UserSelectMenuBuilder()
            .setCustomId('DRTicketAddUser')
            .setPlaceholder('👥 Agregar usuario al ticket')
            .setMinValues(1)
            .setMaxValues(10)
        )
      )
      .addSeparatorComponents((sep) => sep.setSpacing(SeparatorSpacingSize.Large).setDivider(true));

    await channel.send({
      flags: 'IsComponentsV2',
      components: [container],
      files: filesToSend.length ? filesToSend : undefined,
    });

    await interaction.editReply({
      content: `✅ Ticket creado: ${channel}`,
    });

    await TicketUserDR.create({
      GuildId: guild.id,
      ChannelId: channel.id,
      TicketId: ticketName,
      CreadorId: user.id,
      Categoria: 'reporte',
    });
  },
};
