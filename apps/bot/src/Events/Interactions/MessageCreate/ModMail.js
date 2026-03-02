import {
  Events,
  ChannelType,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  Collection,
} from 'discord.js';
import ModMailSession from '#database/models/MXRP/ModMailSession.js';

const cooldowns = new Collection();

export default {
  name: Events.MessageCreate,
  async execute(message, client) {
    if (message.author.bot) return;

    if (message.channel.type === ChannelType.DM) {
      // Rate Limit (2 segundos)
      const now = Date.now();
      const cooldownAmount = 2000;
      if (cooldowns.has(message.author.id)) {
        const expirationTime = cooldowns.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
          await message.react('⏳');
          return;
        }
      }
      cooldowns.set(message.author.id, now);
      setTimeout(() => cooldowns.delete(message.author.id), cooldownAmount);

      const session = await ModMailSession.findOne({
        UserId: message.author.id,
        Active: true,
      });

      if (!session) return;

      try {
        const guild = client.guilds.cache.get(session.GuildId);
        if (!guild) return;

        const thread = await guild.channels.fetch(session.ThreadId);
        if (!thread || thread.archived || thread.locked) {
          session.Active = false;
          await session.save();
          return;
        }

        const content = message.content || '*(Archivo adjunto)*';
        const files = message.attachments.map((a) => a);
        const videoUrls = message.attachments
          .filter((a) => a.contentType?.startsWith('video/'))
          .map((a) => a.url);

        const embed = new EmbedBuilder()
          .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
          .setDescription(content)
          .setColor(0x5865f2) // Blurple
          .setTimestamp();

        if (videoUrls.length > 0) {
          embed.addFields({
            name: 'Videos adjuntos',
            value: videoUrls.join('\n'),
          });
        }

        const firstImage = message.attachments.find((a) => a.contentType?.startsWith('image/'));
        if (firstImage) {
          embed.setImage(firstImage.url);
        }

        await thread.send({
          embeds: [embed],
          files: files,
        });

        await message.react('✅');
      } catch (error) {
        console.error('Error retransmitiendo DM a hilo:', error);
      }
      return;
    }

    // --- ESCENARIO 2: Staff responde en el Hilo de ModMail ---
    if (
      message.channel.type === ChannelType.PrivateThread ||
      message.channel.type === ChannelType.PublicThread
    ) {
      // Rate Limit para staff también
      const now = Date.now();
      const cooldownAmount = 2000;
      if (cooldowns.has(message.author.id)) {
        const expirationTime = cooldowns.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) return;
      }
      cooldowns.set(message.author.id, now);
      setTimeout(() => cooldowns.delete(message.author.id), cooldownAmount);

      const session = await ModMailSession.findOne({
        ThreadId: message.channel.id,
        Active: true,
      });

      if (!session) return;

      try {
        const targetUser = await client.users.fetch(session.UserId);
        const content = message.content || '*(Archivo adjunto)*';
        const files = message.attachments.map((a) => a);
        const videoUrls = message.attachments
          .filter((a) => a.contentType?.startsWith('video/'))
          .map((a) => a.url);

        const embed = new EmbedBuilder()
          .setAuthor({
            name: `Staff (${message.author.tag})`,
            iconURL: message.guild.iconURL() || message.author.displayAvatarURL(),
          })
          .setDescription(content)
          .setColor(0xed4245) // Red
          .setTimestamp();

        if (videoUrls.length > 0) {
          embed.addFields({
            name: 'Videos adjuntos',
            value: videoUrls.join('\n'),
          });
        }

        const firstImage = message.attachments.find((a) => a.contentType?.startsWith('image/'));
        if (firstImage) {
          embed.setImage(firstImage.url);
        }

        await targetUser.send({
          embeds: [embed],
          files: files,
        });

        await message.react('📨');
      } catch (error) {
        if (error.code === 50007) {
          await message.reply({
            content: '❌ El usuario ha bloqueado los DMs o no comparte servidor.',
            components: [
              {
                type: 1,
                components: [
                  new ButtonBuilder()
                    .setCustomId(`CerrarModMail:${session.UserId}`)
                    .setLabel('Cerrar Sesión Forzosamente')
                    .setStyle(ButtonStyle.Secondary),
                ],
              },
            ],
          });
        } else {
          console.error('Error enviando DM:', error);
        }
      }
    }
  },
};
