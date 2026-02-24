import {
  ModalSubmitInteraction,
  AttachmentBuilder,
  MediaGalleryItemBuilder,
  ContainerBuilder,
  SeparatorSpacingSize,
} from 'discord.js';
import fetch from 'node-fetch';
import ApelacionWIPDI from '#database/models/DPInterno/ApelacionWIPDI.js';

export default {
  customId: 'apelar-wip',
  /**
   * @param {ModalSubmitInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    const { guild, user, fields } = interaction;

    const usuarioApelante = fields.getSelectedUsers('Usuario-apelante').first();
    const staffAplicador = fields.getSelectedUsers('Staff-aplicador').first();
    const NumeroWIP = fields.getTextInputValue('NumeroWIP');
    const Motivo = fields.getTextInputValue('Motivo');

    const pruebasAttachments = fields.fields.get('Pruebas')?.attachments ?? new Map();
    const Pruebas = Array.from(pruebasAttachments.values());

    await interaction.deferReply({ flags: 'Ephemeral' });

    const config = await ApelacionWIPDI.findOne({ GuildId: guild.id });

    if (!config) {
      return interaction.editReply({
        content: 'El sistema de apelaciones de WIPs no está configurado.',
      });
    }

    const canalId = config.CanalId;

    if (!canalId) {
      return interaction.editReply({
        content: 'No se encontró un canal configurado para apelaciones de WIPs.',
      });
    }

    const canalDestino = guild.channels.cache.get(canalId);
    if (!canalDestino) {
      return interaction.editReply({
        content: 'El canal configurado para apelaciones no existe o no es accesible.',
      });
    }

    const textContent = `
📋 **Apelación de WIP #${NumeroWIP}**

**Información de la Apelación**
• **Usuario que apela:** <@${usuarioApelante.id}>
• **Staff que aplicó la WIP:** <@${staffAplicador.id}>
• **Creado por:** <@${user.id}>

**Motivo de la Apelación:**
${Motivo}

• Creado: <t:${Math.floor(Date.now() / 1000)}:R>`;

    const filesToSend = [];
    const galleryItems = [];

    for (const att of Pruebas) {
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
      .setAccentColor(0x0099ff)
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
      content: `Tu apelación de WIP ha sido enviada exitosamente al canal ${canalDestino}.`,
    });
  },
};
