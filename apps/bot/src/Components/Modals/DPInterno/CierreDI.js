import {
  ModalSubmitInteraction,
  ChannelType,
  ContainerBuilder,
  ButtonBuilder,
  ButtonStyle,
  MediaGalleryItemBuilder,
  EmbedBuilder,
} from 'discord.js';
import * as discordTranscripts from 'discord-html-transcripts-v2';
import { CacheManager } from '#utils/CacheManager.js';
import TicketUserDI from '#database/models/DPInterno/TicketUserDI.js';

export default {
  customId: 'CierreDI',
  /**
   * @param {ModalSubmitInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    await interaction.deferReply({ flags: 'Ephemeral' });

    const { guild, user, channel, message } = interaction;
    const reason = interaction.fields.getTextInputValue('Razon');

    const ticket = await TicketUserDI.findOne({ TicketId: channel.id });
    if (!ticket || ticket.Estado === 'cerrado') {
      return interaction.editReply({ content: 'Este ticket no es válido o ya fue cerrado.' });
    }

    const setup = await CacheManager.getTicketSetupDI(guild.id);
    if (!setup?.RegistroId) {
      return interaction.editReply({ content: 'No hay canal de registros configurado.' });
    }

    const logChannel = guild.channels.cache.get(setup.RegistroId);
    if (!logChannel || logChannel.type !== ChannelType.GuildText) {
      return interaction.editReply({ content: 'El canal de registros no es válido.' });
    }

    const transcript = await discordTranscripts.createTranscript(channel, {
      filename: `ticket-${channel.id}.html`,
      saveImages: true,
      poweredBy: false,
      sortType: 'ASC',
      includePinnedMessages: true,
      footerText: `Ticket: ${channel.name} | Cerrado por: ${user.tag}\nRazón: ${reason}`,
    });

    await logChannel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle('Ticket Concluido')
          .setThumbnail(client.user.displayAvatarURL())
          .setColor('Random')
          .setDescription(
            `Ticket cerrado por <@${user.id}>\nRazón: ${reason} \nAtendido por: <@${ticket.StaffAsignado}>`
          ),
      ],
      files: [transcript],
    });

    ticket.Estado = 'cerrado';
    ticket.CerradoPor = user.id;
    await ticket.save();

    const originalContainer = message.components[0];

    const sectionComponent = originalContainer.components.find((c) => c.type === 9);
    const textContent = sectionComponent?.components[0]?.content || '';

    const galleryComponent = originalContainer.components.find((c) => c.type === 12);
    const galleryItemBuilders = [];

    if (galleryComponent?.items?.length) {
      galleryComponent.items.forEach((item) => {
        galleryItemBuilders.push(
          new MediaGalleryItemBuilder()
            .setDescription(item.description || '')
            .setURL(item.media.url)
            .setSpoiler(item.spoiler || false)
        );
      });
    }

    const closedContainer = new ContainerBuilder()
      .setAccentColor(0xff0000)
      .addSectionComponents((section) =>
        section
          .addTextDisplayComponents((text) =>
            text.setContent(`${textContent}\n\n🔒 **Ticket cerrado**\n**Razón:** ${reason}`)
          )
          .setThumbnailAccessory((thumb) =>
            thumb.setURL(client.user.displayAvatarURL({ size: 1024, extension: 'png' }))
          )
      );

    if (galleryItemBuilders.length) {
      closedContainer.addMediaGalleryComponents((gallery) =>
        gallery.addItems(...galleryItemBuilders)
      );
    }

    closedContainer.addActionRowComponents((row) =>
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
          .setDisabled(true)
      )
    );

    await message.edit({ components: [closedContainer] });

    await interaction.editReply({
      content: 'El ticket se cerrará en 5 segundos.',
    });

    setTimeout(() => {
      channel.delete().catch(() => {});
    }, 5000);
  },
};
