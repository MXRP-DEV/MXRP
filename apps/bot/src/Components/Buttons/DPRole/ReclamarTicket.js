import { ButtonInteraction } from 'discord.js';
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { CacheManager } from '#utils/CacheManager.js';
import TicketUserDR from '#database/models/DPRole/TicketUserDR.js';

export default {
  customId: 'reclamar_ticket_dr',

  /**
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, channel, member, message } = interaction;

    // Verificar permisos (solo staff puede reclamar)
    const setup = await CacheManager.getTicketSetupDR(guild.id);

    if (!setup) {
      return interaction.reply({
        content: '❌ Sistema no configurado.',
        flags: 'Ephemeral',
      });
    }

    const hasPermission =
      member.roles.cache.has(setup.SpInterno) ||
      member.roles.cache.has(setup.Supervisor) ||
      member.roles.cache.has(setup.SupGeneral) ||
      member.permissions.has('Administrator');

    if (!hasPermission) {
      return interaction.reply({
        content: '❌ No tienes permisos para reclamar este ticket.',
        flags: 'Ephemeral',
      });
    }

    // Verificar si ya está reclamado
    if (message.embeds[0]?.description?.includes('✅ **Reclamado por:**')) {
      return interaction.reply({
        content: '❌ Este ticket ya está reclamado.',
        flags: 'Ephemeral',
      });
    }

    // Actualizar embed para mostrar que está reclamado
    const originalEmbed = message.embeds[0];
    const updatedEmbed = EmbedBuilder.from(originalEmbed)
      .setDescription(originalEmbed.description + '\n\n✅ **Reclamado por:** ' + member.user.tag)
      .setColor('#00FF00');

    // Deshabilitar botón de reclamar
    const disabledRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('cerrar_ticket_dr')
        .setLabel('🔒 Cerrar Ticket')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('reclamar_ticket_dr')
        .setLabel('✅ Ticket Reclamado')
        .setStyle(ButtonStyle.Success)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId('agregar_usuario_dr')
        .setLabel('👥 Agregar Usuario')
        .setStyle(ButtonStyle.Secondary)
    );

    await message.edit({
      embeds: [updatedEmbed],
      components: [disabledRow],
    });

    await interaction.reply({
      content: `✅ Ticket reclamado por ${member.user.tag}`,
    });

    // Actualizar ticket en la base de datos
    await TicketUserDR.updateOne({ ChannelId: channel.id }, { StaffAsignado: member.id });

    // Enviar notificación al canal
    await channel.send({
      content: `🎯 **Ticket reclamado** por ${member}`,
    });
  },
};
