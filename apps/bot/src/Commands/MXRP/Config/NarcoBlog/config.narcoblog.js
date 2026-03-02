import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import NarcoBlogSetup from '#database/models/MXRP/NarcoBlogSetup.js';
import { COMMAND_SCOPES } from '#config/guilds.js';
import { CacheManager } from '#utils/CacheManager.js';

export default {
  subCommand: 'config.narcoblog',
  scope: COMMAND_SCOPES.MXRP,
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, options } = interaction;
    await interaction.deferReply({ flags: 'Ephemeral' });

    const RegistroId = options.getChannel('registro')?.id;
    const NotifyId = options.getChannel('notificar')?.id;

    await NarcoBlogSetup.updateOne(
      { GuildId: guild.id },
      {
        $set: {
          RegistroId,
          NotifyId,
        },
        $setOnInsert: { GuildId: guild.id },
      },
      { upsert: true }
    );

    await CacheManager.invalidateNarcoBlogSetup(guild.id);

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle('✅ Sistema de NarcoBlog Configurado')
          .setColor('DarkRed')
          .addFields(
            { name: 'Canal de Registro (Logs)', value: `<#${RegistroId}>`, inline: true },
            { name: 'Canal de Notificaciones', value: `<#${NotifyId}>`, inline: true }
          )
          .setThumbnail(client.user.displayAvatarURL())
          .setTimestamp(),
      ],
    });
  },
};
