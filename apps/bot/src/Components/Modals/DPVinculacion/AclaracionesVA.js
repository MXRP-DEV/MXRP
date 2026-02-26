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
import TicketUserVA from '#database/models/DPVinculacion/TicketUserVA.js';

export default {
  customId: 'AclaracionesVA',

  /**
   * @param {ModalSubmitInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, user, fields } = interaction;

    const Asunto = fields.getTextInputValue('Asunto');
    const Detalles = fields.getTextInputValue('Detalles');

    await interaction.deferReply({ flags: 'Ephemeral' });

    const setup = await CacheManager.getTicketSetupVA(guild.id);

    if (!setup) {
      return interaction.editReply({
        content: 'El sistema de tickets no está configurado.',
      });
    }

    const categoryId = setup.Aclaraciones;

    if (!categoryId) {
      return interaction.editReply({
        content: 'No se encontró una categoría asignada para Aclaraciones.',
      });
    }

    interaction.editReply({
      content: 'Creando ticket...',
    });

    const channelName = `📨┋${user.username}`.toLowerCase().replace(/ /g, '-');

    const ticketChannel = await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      parent: categoryId,
      topic: `Ticket de ${user.tag} | Aclaraciones`,
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
          id: setup.ClaimRole1,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
          ],
        },
      ],
    });

    if (setup.OpenTicketRole) {
      const member = await guild.members.fetch(user.id);
      await member.roles.add(setup.OpenTicketRole);
    }

    const textContent = `📋 **Aclaraciones**

Estimado <@${user.id}>, un <@&${setup.ClaimRole1}> revisará tu solicitud.
**Asunto:** ${Asunto}
**Detalles:** ${Detalles}

**Información del Ticket**
• Estado: Pendiente
• Creado: <t:${Math.floor(Date.now() / 1000)}:R>`;

    const container = new ContainerBuilder()
      .setAccentColor(0x3498db)
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
      Categoria: 'Aclaraciones',
    });

    await interaction.editReply({
      content: `Tu ticket ha sido creado exitosamente: ${ticketChannel}`,
    });
  },
};
