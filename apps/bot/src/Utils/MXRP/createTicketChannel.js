import {
  ChannelType,
  PermissionsBitField,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  SeparatorSpacingSize,
  UserSelectMenuBuilder,
  MediaGalleryItemBuilder,
  AttachmentBuilder,
} from 'discord.js';
import fetch from 'node-fetch';
import { CacheManager } from '#utils/CacheManager.js';
import TicketUserMXRP from '#database/models/MXRP/TicketUserMXRP.js';
import { getCategoryRoles } from './permissions.js';

export async function createTicketChannel({
  interaction,
  client,
  categoryKey,
  title,
  description,
  files = [],
}) {
  const { guild, user, member } = interaction;
  await interaction.deferReply({ flags: 'Ephemeral' });

  const setup = await CacheManager.getTicketSetupMXRP(guild.id);
  if (!setup)
    return interaction.editReply({ content: 'El sistema de tickets MXRP no está configurado.' });

  const categoryId = setup[categoryKey];
  if (!categoryId)
    return interaction.editReply({
      content: `No se encontró categoría configurada para ${categoryKey}.`,
    });

  const openerRoles =
    categoryKey === 'SoporteVip'
      ? [setup.RolesVip?.Vip, setup.RolesVip?.InversorMXRP, setup.RolesVip?.ServerBooster].filter(
          Boolean
        )
      : categoryKey === 'SoportePrioritario'
        ? [setup.RolesVip?.MXRPPass].filter(Boolean)
        : [];

  if (openerRoles.length) {
    const canOpen = openerRoles.some((rid) => member?.roles?.cache?.has(rid));
    if (!canOpen) {
      return interaction.editReply({
        content: '❌ No tienes permisos para abrir este tipo de ticket.',
      });
    }
  }

  await interaction.editReply({ content: 'Creando ticket...', flags: 'Ephemeral' });

  // Obtener el último número de ticket global del guild
  const lastTicket = await TicketUserMXRP.findOne({ GuildId: guild.id }).sort({ Number: -1 });
  const ticketNumber = (lastTicket?.Number || 0) + 1;

  const emojiMap = {
    SoporteTecnico: '⚙️',
    ReporteStaff: '🛡️',
    Reportes: '🚨',
    Robos: '💸',
    Hosting: '🤖',
    Facciones: '💼',
    Liverys: '🚛',
    RemoverRol: '🔄',
    Peticion: '🎭',
    Warn: '⚠',
    Quejas: '❓',
    CK: '💀',
    Empresas: '🏢',
    // Default emojis for others if needed
    Compras: '🛒',
    ComprasIRL: '💳',
    InePasaporte: '🛂',
    Otros: '📝',
    Disenadores: '🎨',
    Reclamar: '🎁',
    SoporteVip: '💎',
    SoportePrioritario: '🌟',
  };

  const emoji = emojiMap[categoryKey] || '🎫';
  const ticketName = `${emoji}┋ticket${ticketNumber}`;

  const createdAt = Math.floor(Date.now() / 1000);

  const { rolesCanView, rolesToPing } = await getCategoryRoles(guild.id, categoryKey);

  const overwrites = [
    { id: guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
    {
      id: user.id,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory,
      ],
    },
    ...rolesCanView.map((rid) => ({
      id: rid,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory,
        PermissionsBitField.Flags.ManageChannels,
      ],
    })),
  ].filter((o) => o.id);

  const channel = await guild.channels.create({
    name: ticketName,
    type: ChannelType.GuildText,
    parent: categoryId,
    topic: user.tag,
    permissionOverwrites: overwrites,
  });

  const textContent = `🎟️ **${title}**

Estimado: <@${user.id}>${rolesToPing.length ? `, ${rolesToPing.map((r) => `<@&${r}>`).join(', ')} pronto te atenderán.` : ''}

**Información del Ticket**
• **Tipo:** ${title}
• **Solicitante:** ${user.tag}
• **Fecha:** <t:${createdAt}:R>

${description}

• Creado: <t:${createdAt}:R>`;

  const filesToSend = [];
  const galleryItems = [];
  const skippedFiles = [];
  const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB

  // Función auxiliar para procesar adjuntos
  const processAttachment = async (att) => {
    try {
      // Verificar si es video MP4 y excede 10MB
      const isVideo =
        att.name?.toLowerCase().endsWith('.mp4') || att.contentType?.startsWith('video/');
      if (isVideo && att.size > MAX_VIDEO_SIZE) {
        skippedFiles.push(`${att.name} (${(att.size / 1024 / 1024).toFixed(2)}MB - máx 10MB)`);
        return;
      }

      const response = await fetch(att.proxyURL || att.url);
      if (!response.ok) return;
      const buffer = Buffer.from(await response.arrayBuffer());
      filesToSend.push(new AttachmentBuilder(buffer, { name: att.name }));
      galleryItems.push(
        new MediaGalleryItemBuilder()
          .setDescription(`Evidencia subida por ${user.tag}`)
          .setURL(`attachment://${att.name}`)
      );
    } catch {}
  };

  // Adjuntos pasados explícitamente
  if (Array.isArray(files) && files.length) {
    for (const f of files) {
      filesToSend.push(f);
    }
  }

  // Adjuntos subidos vía modal (campo FileUpload)
  const modalFields = interaction.fields?.fields ?? new Map();
  for (const field of modalFields.values()) {
    const attachmentsMap = field?.attachments ?? new Map();
    for (const att of attachmentsMap.values()) {
      await processAttachment(att);
    }
  }

  // Notificar si hay archivos omitidos por tamaño
  if (skippedFiles.length > 0) {
    await interaction.followUp({
      content: `⚠️ Los siguientes videos exceden el límite de 10MB y no fueron adjuntados:\n${skippedFiles.join('\n')}`,
      flags: 'Ephemeral',
    });
  }

  const container = new ContainerBuilder()
    .setAccentColor(0x44ff44)
    .addSectionComponents((section) =>
      section
        .addTextDisplayComponents((text) => text.setContent(textContent))
        .setThumbnailAccessory((thumb) =>
          thumb.setURL(client.user.displayAvatarURL({ size: 1024, extension: 'png' }))
        )
    )
    .addSeparatorComponents((sep) => sep.setSpacing(SeparatorSpacingSize.Small).setDivider(true));

  if (galleryItems.length) {
    container.addMediaGalleryComponents((gallery) => gallery.addItems(...galleryItems));
  }
  container
    .addSeparatorComponents((sep) => sep.setSpacing(SeparatorSpacingSize.Large).setDivider(true))
    .addActionRowComponents((row) =>
      row.addComponents(
        new ButtonBuilder()
          .setCustomId('CloseMXRP')
          .setLabel('Cerrar')
          .setEmoji('🔐')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('ClaimMXRP')
          .setLabel('Reclamar')
          .setEmoji('✍🏻')
          .setStyle(ButtonStyle.Primary)
      )
    )
    .addActionRowComponents((row) =>
      row.addComponents(
        new UserSelectMenuBuilder()
          .setCustomId('MXRPTicketAddUser')
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

  await TicketUserMXRP.create({
    GuildId: guild.id,
    ChannelId: channel.id,
    TicketId: channel.id,
    CreadorId: user.id,
    Categoria: categoryKey,
    Number: ticketNumber,
  });

  await interaction.editReply({ content: `✅ Ticket creado: ${channel}` });
}
