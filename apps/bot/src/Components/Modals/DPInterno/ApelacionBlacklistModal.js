import {
  ModalSubmitInteraction,
  AttachmentBuilder,
  MediaGalleryItemBuilder,
  ContainerBuilder,
  SeparatorSpacingSize,
} from 'discord.js';
import fetch from 'node-fetch';
import { CacheManager } from '#utils/CacheManager.js';

export default {
  customId: 'apelar-blacklist',
  /**
   * @param {ModalSubmitInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, user, fields } = interaction;

    const usuarioApelante = fields.getSelectedUsers('Usuario-apelante').first();
    const staffAplicador = fields.getSelectedUsers('Staff-aplicador').first();
    const Motivo = fields.getTextInputValue('Motivo');

    const pruebasAttachments = fields.fields.get('Pruebas')?.attachments ?? new Map();
    const Pruebas = Array.from(pruebasAttachments.values());

    await interaction.deferReply({ flags: 'Ephemeral' });

    const config = await CacheManager.getApelacionBlacklist(guild.id);

    if (!config) {
      return interaction.editReply({
        content: 'El sistema de apelaciones de blacklist no está configurado.',
      });
    }

    const canalId = config.CanalId;

    if (!canalId) {
      return interaction.editReply({
        content: 'No se encontró un canal configurado para apelaciones de blacklist.',
      });
    }

    const canalDestino = guild.channels.cache.get(canalId);
    if (!canalDestino) {
      return interaction.editReply({
        content: 'El canal configurado para apelaciones no existe o no es accesible.',
      });
    }

    const textContent = `🚫 **Apelación de Blacklist** <@&${config.AsuntosRoleId}>

**Información de la Apelación**
• **Usuario Apelante:** <@${usuarioApelante.id}>
• **Staff que Aplicó la Blacklist:** <@${staffAplicador.id}>
• **Creado por:** <@${user.id}>

**Motivo de la Apelación:**
${Motivo}

• Creado: <t:${Math.floor(Date.now() / 1000)}:R>`;

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
      .addSeparatorComponents((sep) => sep.setSpacing(SeparatorSpacingSize.Large).setDivider(true));

    await canalDestino.send({
      flags: 'IsComponentsV2',
      components: [container],
      files: filesToSend.length ? filesToSend : undefined,
    });

    await interaction.editReply({
      content: `Tu apelación de blacklist ha sido enviada exitosamente al canal ${canalDestino}.`,
    });
  },
};
