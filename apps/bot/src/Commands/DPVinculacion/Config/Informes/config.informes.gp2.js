import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import InformeSetupVA from '#database/models/DPVinculacion/InformeSetupVA.js';
import { COMMAND_SCOPES } from '#config/guilds.js';

export default {
  subCommand: 'config.informes.gp2',
  scope: COMMAND_SCOPES.MXRPVA,

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, options } = interaction;
    await interaction.deferReply({ flags: 'Ephemeral' });

    const CanalId = options.getChannel('canal')?.id;
    const RolId = options.getRole('rol')?.id;

    let Data = await InformeSetupVA.findOne({ GuildId: guild.id });

    if (!Data) {
      Data = await InformeSetupVA.create({
        GuildId: guild.id,
        GP2Channel: CanalId,
        GP2Role: RolId,
      });
    } else {
      Data.GP2Channel = CanalId;
      Data.GP2Role = RolId;
      await Data.save();
    }

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle('✅ Informes GP2 Configurados')
          .setDescription(
            `**Canal:** <#${CanalId}>\n**Rol:** <@&${RolId}>`
          )
          .setColor('Green')
          .setThumbnail(client.user.displayAvatarURL()),
      ],
    });
  },
};
