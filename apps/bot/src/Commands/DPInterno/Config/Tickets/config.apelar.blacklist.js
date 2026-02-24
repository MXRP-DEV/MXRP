import { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import ApelacionBlacklistDI from '#database/models/DPInterno/ApelacionBlacklistDI.js';

export default {
  subCommand: 'config.apelar.blacklist',

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, options, user } = interaction;
    await interaction.deferReply({ flags: 'Ephemeral' });
    const CanalId = options.getChannel('canal')?.id;
    const PermisoRoleId = options.getRole('permiso')?.id;
    const AsuntosRoleId = options.getRole('asuntos')?.id;

    let Data = await ApelacionBlacklistDI.findOne({ GuildId: guild.id });

    if (!Data) {
      Data = await ApelacionBlacklistDI.create({
        GuildId: guild.id,
        CanalId,
        PermisoRoleId,
        AsuntosRoleId,
      });
    } else {
      Data.CanalId = CanalId;
      Data.PermisoRoleId = PermisoRoleId;
      Data.AsuntosRoleId = AsuntosRoleId;
      await Data.save();
    }

    const ConfigEmbed = new EmbedBuilder()
      .setTitle('🚫 Sistema de Apelaciones Blacklist - Configurado')
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription('El sistema de apelaciones de blacklist ha sido configurado exitosamente.')
      .setColor(0x00ff00)
      .addFields(
        {
          name: '📢 Canal',
          value: `<#${CanalId}>`,
        },
        {
          name: '🔐 Rol con Permiso',
          value: `<@&${PermisoRoleId}>`,
        },
        {
          name: '👥 Rol Asuntos Internos',
          value: `<@&${AsuntosRoleId}>`,
        }
      )
      .setFooter({ text: `Configurado por ${user.tag}` })
      .setTimestamp();

    await interaction.editReply({
      embeds: [ConfigEmbed],
    });
  },
};
