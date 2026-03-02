import {
  ButtonInteraction,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  SeparatorSpacingSize,
  PermissionsBitField,
  ChannelType,
} from 'discord.js';
import { CacheManager } from '#utils/CacheManager.js';
import ModMailSession from '#database/models/MXRP/ModMailSession.js';

export default {
  customId: 'AtenderAnonimoMXRP',
  /**
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, user, member, customId, message, channel } = interaction;
    const targetUserId = customId.split(':')[1];

    await interaction.deferReply({ flags: 'Ephemeral' });

    // Validar permisos
    const perms = await CacheManager.getTicketPermisosMXRP(guild.id);
    const allowedRoles = [perms?.Etica, perms?.AsuntosInternos, perms?.RH].filter(Boolean);

    const hasRole = member.roles.cache.hasAny(...allowedRoles);
    const isAdmin = member.permissions.has(PermissionsBitField.Flags.Administrator);

    if (!hasRole && !isAdmin) {
      return interaction.editReply({
        content: '❌ No tienes permisos para atender este reporte anónimo.',
      });
    }

    try {
      // Verificar si ya existe una sesión activa para este usuario
      const existingSession = await ModMailSession.findOne({
        GuildId: guild.id,
        UserId: targetUserId,
        Active: true,
      });

      if (existingSession) {
        return interaction.editReply({
          content: `⚠️ Ya existe una sesión de ModMail activa para este usuario.`,
        });
      }

      const targetUser = await client.users.fetch(targetUserId);
      if (!targetUser) {
        return interaction.editReply({
          content: '❌ No se pudo encontrar al usuario solicitante.',
        });
      }

      // 1. Crear Hilo Privado
      const threadName = `modmail-${targetUser.username}`.toLowerCase().replace(/ /g, '-');
      const thread = await channel.threads.create({
        name: threadName,
        type: ChannelType.PrivateThread,
        autoArchiveDuration: 1440,
        reason: `ModMail con ${targetUser.tag} atendido por ${user.tag}`,
      });

      // Añadir al staff
      await thread.members.add(user.id);

      // Guardar sesión en DB
      await ModMailSession.create({
        GuildId: guild.id,
        UserId: targetUserId,
        ThreadId: thread.id,
        StaffId: user.id,
      });

      // Mensaje inicial en el hilo (V2)
      const introContent = `**Sesión de ModMail Iniciada**

👤 **Usuario:** ${targetUser} (${targetUser.id})
👮 **Staff:** ${user}

📝 **Instrucciones:**
- Todo lo que escribas aquí (sin prefijo) será enviado al usuario por DM.
- Los mensajes del usuario llegarán a este hilo.
- Usa el botón de abajo para cerrar la sesión.`;

      const introContainer = new ContainerBuilder()
        .setAccentColor(0xfee75c)
        .addSectionComponents((section) =>
          section
            .addTextDisplayComponents((text) => text.setContent(introContent))
            .setThumbnailAccessory((thumb) =>
              thumb.setURL(targetUser.displayAvatarURL({ size: 1024, extension: 'png' }))
            )
        )
        .addSeparatorComponents((sep) =>
          sep.setSpacing(SeparatorSpacingSize.Small).setDivider(true)
        )
        .addActionRowComponents((row) =>
          row.addComponents(
            new ButtonBuilder()
              .setCustomId(`CerrarModMail:${targetUser.id}`)
              .setLabel('Cerrar Sesión')
              .setStyle(ButtonStyle.Danger)
              .setEmoji('🔒')
          )
        );

      await thread.send({
        flags: 'IsComponentsV2',
        components: [introContainer],
      });

      // 2. Enviar DM al usuario (V2)
      const dmContent = `👋 **Hola, tu reporte anónimo ha sido atendido.**

Un miembro del staff (**${user.tag}**) ha iniciado una sesión de contacto contigo.
Puedes responder directamente a este mensaje para hablar con el staff.

**Staff Encargado:** <@${user.id}>
**Fecha:** <t:${Math.floor(Date.now() / 1000)}:F>`;

      const dmContainer = new ContainerBuilder()
        .setAccentColor(0x57f287)
        .addSectionComponents((section) =>
          section
            .addTextDisplayComponents((text) => text.setContent(dmContent))
            .setThumbnailAccessory((thumb) =>
              thumb.setURL(client.user.displayAvatarURL({ size: 1024, extension: 'png' }))
            )
        )
        .addSeparatorComponents((sep) =>
          sep.setSpacing(SeparatorSpacingSize.Small).setDivider(true)
        );

      await targetUser.send({
        flags: 'IsComponentsV2',
        components: [dmContainer],
      });

      // 3. Actualizar mensaje original
      const originalText =
        message.components[0]?.components?.[0]?.components?.[0]?.content || 'Reporte atendido';

      const updatedContainer = new ContainerBuilder()
        .setAccentColor(0x57f287)
        .addSectionComponents((section) =>
          section
            .addTextDisplayComponents((text) => text.setContent(originalText))
            .setThumbnailAccessory((thumb) =>
              thumb.setURL(targetUser.displayAvatarURL({ size: 1024, extension: 'png' }))
            )
        )
        .addSeparatorComponents((sep) =>
          sep.setSpacing(SeparatorSpacingSize.Small).setDivider(true)
        )
        .addActionRowComponents((row) =>
          row.addComponents(
            new ButtonBuilder()
              .setCustomId('AtenderAnonimoMXRP_Disabled')
              .setLabel(`Atendido por ${user.username}`)
              .setStyle(ButtonStyle.Success)
              .setEmoji('✅')
              .setDisabled(true),
            new ButtonBuilder()
              .setLabel('Ir al Hilo')
              .setStyle(ButtonStyle.Link)
              .setURL(thread.url)
          )
        );

      await message.edit({
        flags: 'IsComponentsV2',
        components: [updatedContainer],
      });

      return interaction.editReply({
        content: `✅ Sesión de ModMail iniciada en ${thread}.`,
      });
    } catch (error) {
      console.error(error);
      return interaction.editReply({
        content: '❌ Hubo un error al iniciar la sesión (posiblemente DMs cerrados).',
      });
    }
  },
};
