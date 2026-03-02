import {
  ButtonInteraction,
  ContainerBuilder,
  SeparatorSpacingSize,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from 'discord.js';
import ModMailSession from '#database/models/MXRP/ModMailSession.js';

export default {
  customId: 'CerrarModMail',
  /**
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { customId, user, channel } = interaction;
    const targetUserId = customId.split(':')[1];

    await interaction.deferReply({ flags: 'Ephemeral' });

    try {
      // 0. Actualizar DB (Desactivar sesión)
      await ModMailSession.findOneAndUpdate(
        { ThreadId: channel.id, Active: true },
        { Active: false }
      );

      // 1. Notificar al usuario por DM
      const targetUser = await client.users.fetch(targetUserId);
      if (targetUser) {
        const container = new ContainerBuilder()
          .setAccentColor(0xed4245) // Red
          .addSectionComponents((section) =>
            section
              .addTextDisplayComponents((text) =>
                text.setContent(
                  '🔒 **Sesión Finalizada**\n\nEl staff ha cerrado esta sesión de contacto. Gracias.'
                )
              )
              .setThumbnailAccessory((thumb) =>
                thumb.setURL(client.user.displayAvatarURL({ size: 1024, extension: 'png' }))
              )
          )
          .addSeparatorComponents((sep) =>
            sep.setSpacing(SeparatorSpacingSize.Small).setDivider(true)
          );

        await targetUser
          .send({
            flags: 'IsComponentsV2',
            components: [container],
          })
          .catch(() => {});
      }

      // 2. Notificar en el hilo y mostrar botón de reabrir
      await interaction.editReply({
        content: '🔒 Sesión cerrada.',
      });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`ReabrirModMail:${targetUserId}`)
          .setLabel('Reabrir Sesión')
          .setStyle(ButtonStyle.Success)
          .setEmoji('🔓'),
        new ButtonBuilder()
          .setCustomId(`EliminarModMailThread`)
          .setLabel('Borrar Hilo')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('🗑️')
      );

      await channel.send({
        content: `🔒 **Sesión cerrada por ${user.tag}**\n\nEl usuario ha sido notificado. Si esto fue un error, puedes reabrir la sesión abajo.`,
        components: [row],
      });

      // Archivar (pero NO bloquear para permitir reabrir fácilmente si alguien escribe o pulsa botón)
      // Si bloqueamos, el botón no funcionaría para non-admins.
      await channel.setArchived(true);
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: '❌ Error al cerrar la sesión.',
      });
    }
  },
};
