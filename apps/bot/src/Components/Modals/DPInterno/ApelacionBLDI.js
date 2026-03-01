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
import TicketSetupDI from '#database/models/DPInterno/TicketSetupDI.js';
import TicketUserDI from '#database/models/DPInterno/TicketUserDI.js';

export default {
  customId: 'ApelacionBLDI',
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

    const setup = await TicketSetupDI.findOne({ GuildId: guild.id });

    if (!setup) {
      return interaction.editReply({
        content: 'El sistema de tickets no está configurado.',
      });
    }

    const categoryId = setup.ApelacionBL;

    if (!categoryId) {
      return interaction.editReply({
        content: 'No se encontró una categoría asignada para Apelación Blacklist.',
      });
    }

    interaction.editReply({
      content: 'Creando ticket...',
    });

    const channelName = `🚫┋${user.username}`
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^a-z0-9-]/g, '');

    const ticketChannel = await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      parent: categoryId,
      topic: `Ticket de ${user.tag} | Apelación Blacklist`,
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

    const textContent = `🚫 **Apelación Blacklist**

Estimado <@${user.id}>, un <@&${setup.RH}> <@&${setup.AsuntosInternos}> revisará tu solicitud.
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
      .setAccentColor(0x990000)
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
      Categoria: 'ApelacionBL',
    });

    await interaction.editReply({
      content: `Tu ticket ha sido creado exitosamente: ${ticketChannel}`,
    });
  },
};
