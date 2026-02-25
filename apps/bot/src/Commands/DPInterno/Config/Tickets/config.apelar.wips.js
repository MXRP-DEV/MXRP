import { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import ApelacionWIPDI from '#database/models/DPInterno/ApelacionWIPDI.js';
import { COMMAND_SCOPES } from '#config/guilds.js';

export default {
  subCommand: 'config.apelar.wips',
  scope: COMMAND_SCOPES.MXRPDI,

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, options, user } = interaction;
    await interaction.deferReply({ flags: 'Ephemeral' });
    const CanalId = options.getChannel('canal')?.id;
    const PermisoRoleId = options.getRole('permiso')?.id;

    let Data = await ApelacionWIPDI.findOne({ GuildId: guild.id });

    if (!Data) {
      Data = await ApelacionWIPDI.create({
        GuildId: guild.id,
        CanalId,
        PermisoRoleId,
      });
    } else {
      Data.CanalId = CanalId;
      Data.PermisoRoleId = PermisoRoleId;
      await Data.save();
    }

    const ConfigEmbed = new EmbedBuilder()
      .setTitle('📋 Sistema de Apelaciones WIPs - Configurado')
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription('El sistema de apelaciones de WIPs ha sido configurado exitosamente.')
      .setColor(0x00ff00)
      .addFields(
        {
          name: '📢 Canal',
          value: `<#${CanalId}>`,
        },
        {
          name: '🔐 Rol con Permiso',
          value: `<@&${PermisoRoleId}>`,
        }
      )
      .setFooter({ text: `Configurado por ${user.tag}` })
      .setTimestamp();

    await interaction.editReply({
      embeds: [ConfigEmbed],
    });
  },
};
