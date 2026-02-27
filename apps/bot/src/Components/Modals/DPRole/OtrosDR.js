import {
  ModalSubmitInteraction,
  ChannelType,
  PermissionsBitField,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  SeparatorSpacingSize,
  UserSelectMenuBuilder,
} from 'discord.js';
import { CacheManager } from '#utils/CacheManager.js';
import TicketUserDR from '#database/models/DPRole/TicketUserDR.js';

export default {
  customId: 'OtrosDR',

  /**
   * @param {ModalSubmitInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, user, fields } = interaction;

    const consulta = fields.getTextInputValue('pregunta_otros');

    await interaction.deferReply({ flags: 'Ephemeral' });

    const setup = await CacheManager.getTicketSetupDR(guild.id);

    if (!setup) {
      return interaction.editReply({
        content: 'El sistema de tickets DR no está configurado.',
      });
    }

    const categoryId = setup.Otros;

    if (!categoryId) {
      return interaction.editReply({
        content: 'No se encontró una categoría asignada para otros tickets.',
      });
    }

    const category = guild.channels.cache.get(categoryId);
    if (!category || category.type !== ChannelType.GuildCategory) {
      return interaction.editReply({
        content: 'La categoría configurada no es válida.',
      });
    }

    const ticketName = `➕┋${user.username}`.toLowerCase().replace(/ /g, '-');

    const channel = await guild.channels.create({
      name: ticketName,
      type: ChannelType.GuildText,
      parent: categoryId,
      topic: user.id,
      permissionOverwrites: [
        { id: guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
        {
          id: user.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
        {
          id: setup.SpInterno,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
            PermissionsBitField.Flags.ManageChannels,
          ],
        },
      ],
    });

    const createdAt = Math.floor(Date.now() / 1000);

    const textContent = `➕ **Otros Tickets**

Estimado: <@${user.id}>, un miembro de <@&${setup.SpInterno}> pronto te atenderá.

-# Estamos aquí para ayudarte con tus consultas.
-# Por favor, sé claro en tu solicitud.

**Información del Ticket**
• **Tipo:** Otros
• **Solicitante:** ${user.tag}
• **Fecha:** <t:${createdAt}:R>

**Consulta:**
${consulta}

• Creado: <t:${createdAt}:R>`;

    const container = new ContainerBuilder()
      .setAccentColor(0x44ff44)
      .addSectionComponents((section) =>
        section
          .addTextDisplayComponents((text) => text.setContent(textContent))
          .setThumbnailAccessory((thumb) =>
            thumb.setURL(client.user.displayAvatarURL({ size: 1024, extension: 'png' }))
          )
      )
      .addSeparatorComponents((sep) => sep.setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addActionRowComponents((row) =>
        row.addComponents(
          new ButtonBuilder()
            .setCustomId('cerrar_ticket_dr')
            .setLabel('🔒 Cerrar Ticket')
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId('reclamar_ticket_dr')
            .setLabel('✅ Reclamar Ticket')
            .setStyle(ButtonStyle.Success)
        )
      )
      .addActionRowComponents((row) =>
        row.addComponents(
          new UserSelectMenuBuilder()
            .setCustomId('DRTicketAddUser')
            .setPlaceholder('👥 Agregar usuario al ticket')
            .setMinValues(1)
            .setMaxValues(10)
        )
      )
      .addSeparatorComponents((sep) => sep.setSpacing(SeparatorSpacingSize.Large).setDivider(true));

    await channel.send({
      flags: 'IsComponentsV2',
      components: [container],
    });

    await interaction.editReply({
      content: `✅ Ticket creado: ${channel}`,
    });

    await TicketUserDR.create({
      GuildId: guild.id,
      ChannelId: channel.id,
      TicketId: ticketName,
      CreadorId: user.id,
      Categoria: 'otros',
    });
  },
};
