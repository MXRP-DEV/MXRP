import { ModalSubmitInteraction, ChannelType, EmbedBuilder } from 'discord.js';
import { CacheManager } from '#utils/CacheManager.js';
import TicketUserDR from '#database/models/DPRole/TicketUserDR.js';
import * as discordTranscripts from 'discord-html-transcripts-v2';

export default {
  customId: 'CierreTicketDR',

  /**
   * @param {ModalSubmitInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply({ flags: 'Ephemeral' });

    const { guild, user, channel, message } = interaction;
    const reason = interaction.fields.getTextInputValue('Razon');

    const setup = await CacheManager.getTicketSetupDR(guild.id);
    if (!setup?.LogsId) {
      return interaction.editReply({ content: 'No hay canal de logs configurado.' });
    }

    const logChannel = guild.channels.cache.get(setup.LogsId);
    if (!logChannel || logChannel.type !== ChannelType.GuildText) {
      return interaction.editReply({ content: 'El canal de logs no es válido.' });
    }

    const transcript = await discordTranscripts.createTranscript(channel, {
      filename: `ticket-${channel.id}.html`,
      saveImages: true,
      poweredBy: false,
      sortType: 'ASC',
      includePinnedMessages: true,
      footerText: `Ticket: ${channel.name} | Cerrado por: ${user.tag}\nRazón: ${reason}`,
    });

    const logEmbed = new EmbedBuilder()
      .setTitle('🔒 Ticket Cerrado - DR')
      .setColor('#FF4444')
      .addFields(
        { name: '📂 Canal', value: `${channel.name}`, inline: true },
        { name: '👤 Creado por', value: `<@${channel.topic}>`, inline: true },
        { name: '🛑 Cerrado por', value: `${user.tag}`, inline: true },
        {
          name: '📅 Creado',
          value: `<t:${Math.floor(channel.createdTimestamp / 1000)}:R>`,
          inline: true,
        },
        { name: '📅 Cerrado', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true },
        { name: '📝 Razón', value: reason || 'No especificada', inline: false }
      )
      .setThumbnail(client.user.displayAvatarURL())
      .setTimestamp();

    await logChannel.send({
      embeds: [logEmbed],
      files: [transcript],
    });

    await interaction.editReply({
      content: '✅ Ticket cerrado correctamente.',
    });

    await TicketUserDR.updateOne(
      { ChannelId: channel.id },
      {
        Estado: 'cerrado',
        CerradoPor: user.id,
      }
    );

    setTimeout(() => {
      channel.delete('Ticket cerrado').catch(console.error);
    }, 5000);
  },
};
