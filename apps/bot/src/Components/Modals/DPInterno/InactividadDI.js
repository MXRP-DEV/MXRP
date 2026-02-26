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
import { CacheManager } from '#utils/CacheManager.js';
import TicketUserDI from '#database/models/DPInterno/TicketUserDI.js';

export default {
  customId: 'InactividadDI',
  /**
   * @param {ModalSubmitInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, user, fields } = interaction;

    const Asunto = fields.getTextInputValue('Asunto');
    const Detalles = fields.getTextInputValue('Detalles');

    await interaction.deferReply({ flags: 'Ephemeral' });

    const setup = await CacheManager.getTicketSetupDI(guild.id);

    if (!setup) {
      return interaction.editReply({
        content: 'El sistema de tickets no está configurado.',
      });
    }

    const categoryId = setup.Inactividad;

    if (!categoryId) {
      return interaction.editReply({
        content: 'No se encontró una categoría asignada para Solicitud de Inactividad.',
      });
    }

    interaction.editReply({
      content: 'Creando ticket...',
    });

    const channelName = `⏱️┋${user.username}`.toLowerCase().replace(/ /g, '-');

    const ticketChannel = await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      parent: categoryId,
      topic: `Ticket de ${user.tag} | Solicitud de Inactividad`,
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
          id: setup.RH,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
        {
          id: setup.AsuntosInternos,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
      ],
    });

    const textContent = `⏱️ **Solicitud de Inactividad**

Estimado <@${user.id}>, un <@&${setup.RH}> revisará tu solicitud.
**Asunto:** ${Asunto}
**Detalles:** ${Detalles}

**Información del Ticket**
• Estado: Pendiente
• Creado: <t:${Math.floor(Date.now() / 1000)}:R>`;

    const container = new ContainerBuilder()
      .setAccentColor(0x00ccff)
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
            .setCustomId('CloseDI')
            .setLabel('Cerrar')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🔐')
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId('ClaimDI')
            .setLabel('Reclamar')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('✍🏻')
            .setDisabled(false)
        )
      )
      .addActionRowComponents((row) =>
        row.addComponents(
          new UserSelectMenuBuilder()
            .setCustomId('DITicketAddUser')
            .setPlaceholder('👥 Agregar usuario al ticket')
            .setMinValues(1)
            .setMaxValues(10)
        )
      );

    await ticketChannel.send({
      flags: 'IsComponentsV2',
      components: [container],
    });

    await TicketUserDI.create({
      GuildId: guild.id,
      ChannelId: ticketChannel.id,
      TicketId: ticketChannel.id,
      CreadorId: user.id,
      Categoria: 'Inactividad',
    });

    await interaction.editReply({
      content: `Tu ticket ha sido creado exitosamente: ${ticketChannel}`,
    });
  },
};
