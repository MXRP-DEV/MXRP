import {
  ButtonInteraction,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from 'discord.js';
import ModMailSession from '#database/models/MXRP/ModMailSession.js';

export default {
  customId: 'ReabrirModMail',
  /**
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { customId, user, channel } = interaction;
    const targetUserId = customId.split(':')[1];

    await interaction.deferReply({ flags: 'Ephemeral' });

    try {
      // 1. Reactivar sesión en DB
      const session = await ModMailSession.findOneAndUpdate(
        { ThreadId: channel.id, UserId: targetUserId },
        { Active: true },
        { new: true }
      );

      if (!session) {
        return interaction.editReply({
          content: '❌ No se encontró la sesión original para reabrir.',
        });
      }

      // 2. Desarchivar el hilo
      await channel.setArchived(false);
      await channel.setLocked(false);

      // 3. Notificar en el hilo y volver a mostrar el botón de cerrar
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`CerrarModMail:${targetUserId}`)
          .setLabel('Cerrar Sesión')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('🔒')
      );

      await channel.send({
        content: `🔓 **Sesión reabierta por ${user.tag}**`,
        components: [row],
      });

      // 4. (Opcional) Notificar al usuario que se reabrió
      const targetUser = await client.users.fetch(targetUserId);
      if (targetUser) {
        await targetUser
          .send({
            content: `🔓 **Sesión Reabierta**\nEl staff ha reabierto la conversación.`,
          })
          .catch(() => {});
      }

      await interaction.editReply({
        content: '✅ Sesión reabierta correctamente.',
      });
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: '❌ Error al reabrir la sesión.',
      });
    }
  },
};
