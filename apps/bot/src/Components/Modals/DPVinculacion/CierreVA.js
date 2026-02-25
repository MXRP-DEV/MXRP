import {
  ModalSubmitInteraction,
  ChannelType,
  ContainerBuilder,
  ButtonBuilder,
  ButtonStyle,
  MediaGalleryItemBuilder,
} from 'discord.js';
import * as discordTranscripts from 'discord-html-transcripts-v2';
import TicketSetupVA from '#database/models/DPVinculacion/TicketSetupVA.js';
import TicketUserVA from '#database/models/DPVinculacion/TicketUserVA.js';

export default {
  customId: 'CierreVA',
  /**
   * @param {ModalSubmitInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    await interaction.deferReply({ flags: 'Ephemeral' });

    const { guild, user, channel, message } = interaction;
    const reason = interaction.fields.getTextInputValue('Razon');

    const ticket = await TicketUserVA.findOne({ TicketId: channel.id });
    if (!ticket || ticket.Estado === 'cerrado') {
      return interaction.editReply({ content: 'Este ticket no es válido o ya fue cerrado.' });
    }

    const setup = await TicketSetupVA.findOne({ GuildId: guild.id });
    if (!setup?.LogsId) {
      return interaction.editReply({ content: 'No hay canal de logs configurado.' });
    }

    const logChannel = guild.channels.cache.get(setup.LogsId);
    if (!logChannel || logChannel.type !== ChannelType.GuildText) {
      return interaction.editReply({ content: 'El canal de logs no es válido.' });
    }

    // Remover rol de ticket abierto del creador
    if (setup.OpenTicketRole && ticket.CreadorId) {
      try {
        const member = await guild.members.fetch(ticket.CreadorId);
        await member.roles.remove(setup.OpenTicketRole);
      } catch {}
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
      content: `🔒 Ticket cerrado por <@${user.id}>\nRazón: ${reason}`,
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
          .setCustomId('CloseVA')
          .setLabel('Cerrar')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('🔐')
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId('ClaimVA')
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
