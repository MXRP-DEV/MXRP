import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import WelcomeSetupVA from '#database/models/DPVinculacion/WelcomeSetupVA.js';
import { COMMAND_SCOPES } from '#config/guilds.js';

export default {
  subCommand: 'config.welcome',
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

    let Data = await WelcomeSetupVA.findOne({ GuildId: guild.id });

    if (!Data) {
      Data = await WelcomeSetupVA.create({
        GuildId: guild.id,
        Channel: CanalId,
        Role: RolId,
      });
    } else {
      Data.Channel = CanalId;
      Data.Role = RolId;
      await Data.save();
    }

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle('✅ Sistema de Bienvenida Configurado')
          .setDescription(`**Canal:** <#${CanalId}>\n**Rol:** <@&${RolId}>`)
          .setColor('Green')
          .setThumbnail(client.user.displayAvatarURL()),
      ],
    });
  },
};
