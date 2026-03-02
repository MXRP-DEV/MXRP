import {
  ModalSubmitInteraction,
  ContainerBuilder,
  MediaGalleryItemBuilder,
  AttachmentBuilder,
  SeparatorSpacingSize,
  Colors,
} from 'discord.js';
import fetch from 'node-fetch';
import { CacheManager } from '#utils/CacheManager.js';

const countries = {
  Australia: '🇦🇺',
  Canada: '🇨🇦',
  Germany: '🇩🇪',
  Kingdom: '🇬🇧',
  UnitedStates: '🇺🇸',
  France: '🇫🇷',
  Japan: '🇯🇵',
  Brazil: '🇧🇷',
  Mexico: '🇲🇽',
  Italy: '🇮🇹',
  Spain: '🇪🇸',
  India: '🇮🇳',
  China: '🇨🇳',
  Korea: '🇰🇷',
  Russia: '🇷🇺',
  Argentina: '🇦🇷',
  Colombia: '🇨🇴',
  Chile: '🇨🇱',
  Africa: '🇿🇦',
};

function generateRandomIP() {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

function getRandomCountry() {
  const countryKeys = Object.keys(countries);
  const country = countryKeys[Math.floor(Math.random() * countryKeys.length)];
  return `${country} ${countries[country]}`;
}

export default {
  customId: 'NarcoModalMXRP',
  /**
   * @param {ModalSubmitInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, user, fields } = interaction;

    await interaction.deferReply({ flags: 'Ephemeral' });
    await interaction.editReply({
      content: '📤 Subiendo anuncio al NarcoBlog, por favor espera...',
    });

    const setup = await CacheManager.getNarcoBlogSetup(guild.id);
    if (!setup || !setup.RegistroId || !setup.NotifyId) {
      return interaction.editReply({
        content: '❌ El sistema de NarcoBlog no está configurado.',
      });
    }

    const registroChannel = guild.channels.cache.get(setup.RegistroId);
    const notifyChannel = guild.channels.cache.get(setup.NotifyId);

    if (!registroChannel || !notifyChannel) {
      return interaction.editReply({
        content: '❌ Uno de los canales configurados no existe.',
      });
    }

    const mensajeRaw = fields.getTextInputValue('mensaje');
    const vpn = fields.getStringSelectValues('vpn')?.[0] || 'no';
    const colorStr = fields.getStringSelectValues('color')?.[0];
    const color = vpn === 'si' ? Colors.DarkGrey : parseInt(colorStr) || Colors.Red;

    const usuariosField = fields.fields.get('usuarios');
    const usuariosPing = usuariosField?.users?.map((u) => u.id) || [];
    const usuariosPingIds = usuariosPing.length > 0 ? usuariosPing : usuariosField?.values || [];

    const mensaje = mensajeRaw.replace(/^#+\s*/, '');

    const filesToSend = [];
    const galleryItems = [];
    const skippedFiles = [];
    const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB

    const mediaField = fields.fields.get('media');
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
            .setDescription(vpn === 'si' ? 'Media Anónima' : `Media de ${user.tag}`)
            .setURL(`attachment://${fileName}`)
        );
      } catch (err) {
        console.error('Error procesando archivo para NarcoBlog:', err);
      }
    }

    if (skippedFiles.length > 0) {
      await interaction.followUp({
        content: `⚠️ Archivos omitidos por exceder 10MB:\n${skippedFiles.join('\n')}`,
        flags: 'Ephemeral',
      });
    }

    const pingsText =
      usuariosPingIds.length > 0
        ? `\n**Pings:** ${usuariosPingIds.map((u) => `<@${u}>`).join(' ')}`
        : '';
    const registroHeader = `# 📝 Registro de NarcoBlog\n**Usuario:** <@${user.id}> (${user.tag})\n**VPN:** ${vpn === 'si' ? '✅ Si' : '❌ No'}${pingsText}\n**Mensaje:**\n${mensaje}`;

    const registroContainer = new ContainerBuilder()
      .setAccentColor(color)
      .addSectionComponents((section) =>
        section
          .addTextDisplayComponents((text) => text.setContent(registroHeader))
          .setThumbnailAccessory((thumb) =>
            thumb.setURL(user.displayAvatarURL({ size: 1024, extension: 'png' }))
          )
      )
      .addSeparatorComponents((sep) => sep.setSpacing(SeparatorSpacingSize.Small).setDivider(true));

    if (galleryItems.length > 0) {
      registroContainer.addMediaGalleryComponents((gallery) => gallery.addItems(...galleryItems));
    }

    await registroChannel.send({
      flags: 'IsComponentsV2',
      components: [registroContainer],
      files: filesToSend,
    });

    const ip = generateRandomIP();
    const country = getRandomCountry();

    const header =
      vpn === 'si'
        ? `🔒 **Mensaje Interceptado**\n**Origen:** ${country} | **IP:** ${ip}`
        : `🔓 **Mensaje Público**\n**Usuario:** <@${user.id}>`;

    const textContent = `${header}\n\n# Mensaje\n${mensaje}\n\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯${usuariosPingIds.length > 0 ? `\n\n**Menciones:** ${usuariosPingIds.map((u) => `<@${u}>`).join(' ')}` : ''}`;

    const container = new ContainerBuilder()
      .setAccentColor(color)
      .addSectionComponents((section) => {
        section.addTextDisplayComponents((text) => text.setContent(textContent));

        if (vpn === 'no') {
          section.setThumbnailAccessory((thumb) =>
            thumb.setURL(user.displayAvatarURL({ size: 1024, extension: 'png' }))
          );
        } else {
          section.setThumbnailAccessory((thumb) =>
            thumb.setURL(client.user.displayAvatarURL({ size: 1024, extension: 'png' }))
          );
        }
        return section;
      })
      .addSeparatorComponents((sep) => sep.setSpacing(SeparatorSpacingSize.Small).setDivider(true));

    if (galleryItems.length > 0) {
      container.addMediaGalleryComponents((gallery) => gallery.addItems(...galleryItems));
    }

    try {
      await notifyChannel.send({
        flags: 'IsComponentsV2',
        components: [container],
        files: filesToSend,
      });

      await interaction.editReply({
        content: '✅ Tu mensaje ha sido enviado al NarcoBlog exitosamente.',
      });
    } catch (error) {
      console.error('Error publicando en NarcoBlog:', error);
      await interaction.editReply({
        content: '❌ Ocurrió un error al publicar el mensaje.',
      });
    }
  },
};
