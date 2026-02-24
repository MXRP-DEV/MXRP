import { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import ApelacionDespidoDI from '#database/models/DPInterno/ApelacionDespidoDI.js';

export default {
  subCommand: 'config.apelar.despidos',

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, options, user } = interaction;
    await interaction.deferReply({ flags: 'Ephemeral' });

    const CanalId = options.getChannel('canal')?.id;
    const PermisoRoleId = options.getRole('permiso')?.id;
    const RHRolId = options.getRole('rh')?.id;

    let Data = await ApelacionDespidoDI.findOne({ GuildId: guild.id });

    if (!Data) {
      Data = await ApelacionDespidoDI.create({
        GuildId: guild.id,
        CanalId,
        PermisoRoleId,
        RHRolId,
      });
    } else {
      Data.CanalId = CanalId;
      Data.PermisoRoleId = PermisoRoleId;
      Data.RHRolId = RHRolId;
      await Data.save();
    }

    const ConfigEmbed = new EmbedBuilder()
      .setTitle('⚖️ Sistema de Apelaciones de Despidos - Configurado')
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription('El sistema de apelaciones de despidos ha sido configurado exitosamente.')
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
          name: '👥 Rol RH',
          value: `<@&${RHRolId}>`,
        }
      )
      .setFooter({ text: `Configurado por ${user.tag}` })
      .setTimestamp();

    await interaction.editReply({
      embeds: [ConfigEmbed],
    });
  },
};
