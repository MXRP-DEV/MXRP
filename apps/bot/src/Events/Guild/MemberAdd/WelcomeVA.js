import { Events, EmbedBuilder, AttachmentBuilder } from 'discord.js';
import { Assets } from '#utils/Assets/Assets.js';
import WelcomeSetupVA from '#database/models/DPVinculacion/WelcomeSetupVA.js';
import canvafy from 'bun-canvafy';

export default {
  name: Events.GuildMemberAdd,

  /**
   * @param {GuildMember} member
   * @param {Client} client
   */
  async execute(member, client) {
    if (member.guild.id !== process.env.GUILD_MXRPVA) return;

    const setup = await WelcomeSetupVA.findOne({ GuildId: member.guild.id });

    if (!setup || !setup.Channel || !setup.Role) {
      return;
    }

    const channel = member.guild.channels.cache.get(setup.Channel);

    if (!channel || !channel.isTextBased()) {
      return;
    }

    try {
      const Image = await new canvafy.WelcomeLeave()
        .setAvatar(member.user.displayAvatarURL({ forceStatic: true, extension: 'png' }))
        .setBackground('image', Assets.BANNERMXRP)
        .setBorder('#4C0DB2')
        .setAvatarBorder('#09EA57')
        .setOverlayOpacity(0.3)
        .setTitle('Bienvenido a MXRP')
        .setDescription(`${member.user.tag}`)
        .build();

      const embed = new EmbedBuilder()
        .setColor('#841b9d')
        .setTitle('🌟 ¡Bienvenido a MXRP Vinculación!')
        .setDescription(
          `¡Hola ${member.user}! 🎉\n\n` +
            `**📋 Información Importante:**\n` +
            `• Revisa nuestras <#1288263082447212646>\n` +
            `• Visita nuestro canal de <#1375900473697243267>\n\n` +
            `**👤 Usuario:** ${member.user.tag}\n` +
            `**📅 Fecha:** <t:${Math.floor(Date.now() / 1000)}:F>`
        )
        .setImage('attachment://welcome.png')
        .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
        .setFooter({
          text: `MXRP© • Miembro #${member.guild.memberCount}`,
          iconURL: client.user.displayAvatarURL(),
        })
        .setTimestamp();

      const attachment = new AttachmentBuilder(Image, {
        name: 'welcome.png',
      });

      await channel.send({
        embeds: [embed],
        files: [attachment],
      });

      const role = member.guild.roles.cache.get(setup.Role);
      if (role) {
        await member.roles.add(role);
      } else {
        console.error(`Rol de bienvenida no encontrado: ${setup.Role}`);
      }
    } catch (error) {
      console.error('Error al enviar mensaje de bienvenida:', error);
    }
  },
};
