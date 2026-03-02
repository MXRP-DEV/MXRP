import {
  ModalSubmitInteraction,
  ContainerBuilder,
  MediaGalleryItemBuilder,
  AttachmentBuilder,
  SeparatorSpacingSize,
  Collection,
  Colors,
} from 'discord.js';
import fetch from 'node-fetch';
import { CacheManager } from '#utils/CacheManager.js';

export default {
  customId: 'PeriodicoModalMXRP',
  /**
   * @param {ModalSubmitInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, user, fields } = interaction;
    await interaction.deferReply({ flags: 'Ephemeral' });

    const setup = await CacheManager.getPeriodicoSetup(guild.id);
    if (!setup || !setup.CanalNoticias) {
      return interaction.editReply({ content: '❌ El sistema de periódico no está configurado.' });
    }

    const canalNoticias = guild.channels.cache.get(setup.CanalNoticias);
    if (!canalNoticias) {
      return interaction.editReply({ content: '❌ El canal de noticias configurado no existe.' });
    }

    const tituloRaw = fields.getTextInputValue('titulo');
    const descripcion = fields.getTextInputValue('contenido');
    const colorStr = fields.getStringSelectValues('color')[0];
    const color = parseInt(colorStr) || Colors.NotQuiteBlack;

    const titulo = tituloRaw.replace(/^#+\s*/, '');

    const filesToSend = [];
    const galleryItems = [];
    const skippedFiles = [];
    const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB

    const mediaField = fields.fields.get('imagen');
    const attachments = mediaField?.attachments ?? new Map();

    for (const att of attachments.values()) {
      try {
        const isVideo =
          att.contentType?.startsWith('video/') || att.name?.toLowerCase().endsWith('.mp4');
        if (isVideo && att.size > MAX_VIDEO_SIZE) {
          skippedFiles.push(`${att.name} (Excede 10MB)`);
          continue;
        }

        const response = await fetch(att.proxyURL || att.url);
        if (!response.ok) continue;
        const buffer = Buffer.from(await response.arrayBuffer());

        const fileName = att.name;
        filesToSend.push(new AttachmentBuilder(buffer, { name: fileName }));

        galleryItems.push(
          new MediaGalleryItemBuilder()
            .setDescription(`Media de ${user.tag}`)
            .setURL(`attachment://${fileName}`)
        );
      } catch (err) {
        console.error('Error procesando archivo para periódico:', err);
      }
    }

    if (skippedFiles.length > 0) {
      await interaction.followUp({
        content: `⚠️ Algunos videos fueron omitidos por exceder los 10MB:\n${skippedFiles.join('\n')}`,
        flags: 'Ephemeral',
      });
    }

    const textContent = `# ${titulo}\n\n${descripcion}\n\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n*Publicado por:* <@${user.id}>`;

    const container = new ContainerBuilder()
      .setAccentColor(color)
      .addSectionComponents((section) =>
        section
          .addTextDisplayComponents((text) => text.setContent(textContent))
          .setThumbnailAccessory((thumb) =>
            thumb.setURL(user.displayAvatarURL({ size: 1024, extension: 'png' }))
          )
      )
      .addSeparatorComponents((sep) => sep.setSpacing(SeparatorSpacingSize.Small).setDivider(true));

    if (galleryItems.length > 0) {
      container.addMediaGalleryComponents((gallery) => gallery.addItems(...galleryItems));
    }

    try {
      await canalNoticias.send({
        flags: 'IsComponentsV2',
        components: [container],
        files: filesToSend.length ? filesToSend : undefined,
      });

      await interaction.editReply({
        content: `✅ Noticia publicada exitosamente en ${canalNoticias}.`,
      });
    } catch (error) {
      console.error('Error publicando noticia:', error);
      await interaction.editReply({
        content: '❌ Ocurrió un error al intentar publicar la noticia.',
      });
    }
  },
};
