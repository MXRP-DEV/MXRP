import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import PeriodicoSetup from '#database/models/MXRP/PeriodicoSetup.js';
import { COMMAND_SCOPES } from '#config/guilds.js';
import { CacheManager } from '#utils/CacheManager.js';

export default {
  subCommand: 'config.periodico',
  scope: COMMAND_SCOPES.MXRP,
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, options } = interaction;
    await interaction.deferReply({ flags: 'Ephemeral' });

    const CanalNoticias = options.getChannel('canal')?.id;
    const RolPeriodista = options.getRole('rol')?.id;

    await PeriodicoSetup.updateOne(
      { GuildId: guild.id },
      {
        $set: {
          CanalNoticias,
          RolPeriodista,
        },
        $setOnInsert: { GuildId: guild.id },
      },
      { upsert: true }
    );

    await CacheManager.invalidatePeriodicoSetup(guild.id);

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle('✅ Sistema de Periódico Configurado')
          .setColor('Green')
          .addFields(
            { name: 'Canal de Noticias', value: `<#${CanalNoticias}>`, inline: true },
            { name: 'Rol Periodista', value: `<@&${RolPeriodista}>`, inline: true }
          )
          .setThumbnail(client.user.displayAvatarURL())
          .setTimestamp(),
      ],
    });
  },
};
