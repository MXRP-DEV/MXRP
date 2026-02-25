import {
  ModalSubmitInteraction,
  ChannelType,
  PermissionsBitField,
  ButtonBuilder,
  ButtonStyle,
  UserSelectMenuBuilder,
  ContainerBuilder,
  SeparatorSpacingSize,
} from 'discord.js';
import TicketSetupVA from '#database/models/DPVinculacion/TicketSetupVA.js';
import TicketUserVA from '#database/models/DPVinculacion/TicketUserVA.js';

export default {
  customId: 'SoporteVipVA',

  /**
   * @param {ModalSubmitInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, user, fields, member } = interaction;

    const Asunto = fields.getTextInputValue('Asunto');
    const Detalles = fields.getTextInputValue('Detalles');

    await interaction.deferReply({ flags: 'Ephemeral' });

    const setup = await TicketSetupVA.findOne({ GuildId: guild.id });

    if (!setup) {
      return interaction.editReply({
        content: 'El sistema de tickets no está configurado.',
      });
    }

    // Verificar si el usuario tiene rol VIP, Partner o Inversor
    const hasVipRole = setup.VipRole && member.roles.cache.has(setup.VipRole);
    const hasPartnerRole = setup.PartnerRole && member.roles.cache.has(setup.PartnerRole);
    const hasInversorRole = setup.InversorRole && member.roles.cache.has(setup.InversorRole);

    if (!hasVipRole && !hasPartnerRole && !hasInversorRole) {
      return interaction.editReply({
        content:
          'No tienes permiso para abrir tickets VIP. Este servicio es exclusivo para usuarios VIP, Partners o Inversores.',
      });
    }

    const categoryId = setup.VIP;

    if (!categoryId) {
      return interaction.editReply({
        content: 'No se encontró una categoría asignada para Soporte VIP.',
      });
    }

    interaction.editReply({
      content: 'Creando ticket VIP...',
    });

    const channelName = `💎┋${user.username}`.toLowerCase().replace(/ /g, '-');

    const ticketChannel = await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      parent: categoryId,
      topic: `Ticket de ${user.tag} | Soporte VIP`,
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
          id: setup.ClaimRole3,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
      ],
    });

    // Asignar rol de ticket abierto al usuario
    if (setup.OpenTicketRole) {
      await member.roles.add(setup.OpenTicketRole);
    }

    const textContent = `💎 **Soporte VIP**

Estimado <@${user.id}>, un <@&${setup.ClaimRole3}> revisará tu solicitud.
**Asunto:** ${Asunto}
**Detalles:** ${Detalles}

**Información del Ticket**
• Estado: Pendiente
• Tipo: VIP
• Creado: <t:${Math.floor(Date.now() / 1000)}:R>`;

    const container = new ContainerBuilder()
      .setAccentColor(0xf1c40f)
      .addSectionComponents((section) =>
        section
          .addTextDisplayComponents((text) => text.setContent(textContent))
          .setThumbnailAccessory((thumb) =>
            thumb.setURL(client.user.displayAvatarURL({ size: 1024, extension: 'png' }))
          )
      )
      .addSeparatorComponents((sep) => sep.setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addSeparatorComponents((sep) => sep.setSpacing(SeparatorSpacingSize.Large).setDivider(true))
      .addActionRowComponents((row) =>
        row.addComponents(
          new ButtonBuilder()
            .setCustomId('CloseVA')
            .setLabel('Cerrar')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🔐')
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId('ClaimVA')
            .setLabel('Reclamar')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('✍🏻')
            .setDisabled(false)
        )
      )
      .addActionRowComponents((row) =>
        row.addComponents(
          new UserSelectMenuBuilder()
            .setCustomId('VATicketAddUser')
            .setPlaceholder('👥 Agregar usuario al ticket')
            .setMinValues(1)
            .setMaxValues(10)
        )
      );

    await ticketChannel.send({
      flags: 'IsComponentsV2',
      components: [container],
    });

    await TicketUserVA.create({
      GuildId: guild.id,
      ChannelId: ticketChannel.id,
      TicketId: ticketChannel.id,
      CreadorId: user.id,
      Categoria: 'VIP',
    });

    await interaction.editReply({
      content: `Tu ticket VIP ha sido creado exitosamente: ${ticketChannel}`,
    });
  },
};
