import {
  ModalSubmitInteraction,
  ContainerBuilder,
  SeparatorSpacingSize,
  MediaGalleryItemBuilder,
  AttachmentBuilder,
} from 'discord.js';
import fetch from 'node-fetch';
import { CacheManager } from '#utils/CacheManager.js';

export default {
  customId: 'InformeGP1',

  /**
   * @param {ModalSubmitInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, user, fields } = interaction;

    await interaction.deferReply({ flags: 'Ephemeral' });

    const setup = await CacheManager.getInformeSetupVA(guild.id);

    if (!setup || !setup.GP1Channel || !setup.GP1Role) {
      return interaction.editReply({
        content: '❌ El sistema de informes GP1 no está configurado. Contacta un administrador.',
      });
    }

    const observacion = fields.getTextInputValue('Observacion');
    const notas = fields.getTextInputValue('Notas');
    const sugerencias = fields.getTextInputValue('Sugerencias') || 'Sin sugerencias';

    const pruebasAttachments = fields.fields.get('Pruebas')?.attachments ?? new Map();
    const archivos = Array.from(pruebasAttachments.values());

    if (archivos.length < 2) {
      return interaction.editReply({
        content: '❌ Debes subir al menos 2 pruebas.',
      });
    }

    const canal = await guild.channels.fetch(setup.GP1Channel);

    if (!canal || !canal.isTextBased()) {
      return interaction.editReply({
        content: '❌ No se pudo encontrar el canal configurado. Contacta un administrador.',
      });
    }

    const textContent = `📝 **Registro Semanal GP1**

<@&${setup.GP1Role}> - Nuevo informe de <@${user.id}>

**📌 Observación**
${observacion}

**📝 Notas Extras**
${notas}

**💡 Sugerencias**
${sugerencias}

**Información del Informe**
• Enviado: <t:${Math.floor(Date.now() / 1000)}:R>
• Sistema: MXVA`;

    const filesToSend = [];
    const galleryItems = [];
    const skippedFiles = [];
    const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB en bytes

    for (const att of archivos) {
      try {
        // Verificar si es video MP4 y excede 10MB
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
            .setDescription(`Prueba ${galleryItems.length + 1} - ${user.tag}`)
            .setURL(`attachment://${att.name}`)
        );
      } catch {}
    }

    // Notificar si hay archivos omitidos por tamaño
    if (skippedFiles.length > 0) {
      await interaction.followUp({
        content: `⚠️ Los siguientes videos exceden el límite de 10MB y no fueron adjuntados:\n${skippedFiles.join('\n')}`,
        flags: 'Ephemeral',
      });
    }

    const container = new ContainerBuilder()
      .setAccentColor(0xdadada)
      .addSectionComponents((section) =>
        section
          .addTextDisplayComponents((text) => text.setContent(textContent))
          .setThumbnailAccessory((thumb) =>
            thumb.setURL(client.user.displayAvatarURL({ size: 1024, extension: 'png' }))
          )
      )
      .addSeparatorComponents((sep) => sep.setSpacing(SeparatorSpacingSize.Small).setDivider(true));

    if (galleryItems.length > 0) {
      container.addMediaGalleryComponents((gallery) => gallery.addItems(...galleryItems));
    }

    container.addSeparatorComponents((sep) =>
      sep.setSpacing(SeparatorSpacingSize.Large).setDivider(true)
    );

    await canal.send({
      flags: 'IsComponentsV2',
      components: [container],
      files: filesToSend.length ? filesToSend : undefined,
    });

    await interaction.editReply({
      content: '✅ Informe GP1 enviado correctamente.',
    });
  },
};
