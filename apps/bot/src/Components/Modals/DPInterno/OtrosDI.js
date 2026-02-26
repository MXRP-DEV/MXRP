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
import { CacheManager } from '#utils/CacheManager.js';
import TicketUserDI from '#database/models/DPInterno/TicketUserDI.js';

export default {
  customId: 'OtrosDI',
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

    const setup = await CacheManager.getTicketSetupDI(guild.id);

    if (!setup) {
      return interaction.editReply({
        content: 'El sistema de tickets no está configurado.',
      });
    }

    const categoryId = setup.Otros;

    if (!categoryId) {
      return interaction.editReply({
        content: 'No se encontró una categoría asignada para Otros.',
      });
    }

    interaction.editReply({
      content: 'Creando ticket...',
    });

    const channelName = `⚙️┋${user.username}`.toLowerCase().replace(/ /g, '-');

    const ticketChannel = await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      parent: categoryId,
      topic: `Ticket de ${user.tag} | Otros`,
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
          id: setup.RH,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
        {
          id: setup.AsuntosInternos,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
      ],
    });

    const textContent = `⚙️ **Otros**

Estimado <@${user.id}>, un <@&${setup.RH}> revisará tu solicitud.
**Asunto:** ${Asunto}
**Detalles:** ${Detalles}

**Información del Ticket**
• Estado: Pendiente
• Creado: <t:${Math.floor(Date.now() / 1000)}:R>`;

    const filesToSend = [];
    const galleryItems = [];
    const skippedFiles = [];
    const MAX_VIDEO_SIZE = 10 * 1024 * 1024;

    for (const att of Evidencias) {
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
      .setAccentColor(0x999999)
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
            .setCustomId('CloseDI')
            .setLabel('Cerrar')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🔐')
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId('ClaimDI')
            .setLabel('Reclamar')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('✍🏻')
            .setDisabled(false)
        )
      )
      .addActionRowComponents((row) =>
        row.addComponents(
          new UserSelectMenuBuilder()
            .setCustomId('DITicketAddUser')
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

    await TicketUserDI.create({
      GuildId: guild.id,
      ChannelId: ticketChannel.id,
      TicketId: ticketChannel.id,
      CreadorId: user.id,
      Categoria: 'Otros',
    });

    await interaction.editReply({
      content: `Tu ticket ha sido creado exitosamente: ${ticketChannel}`,
    });
  },
};
