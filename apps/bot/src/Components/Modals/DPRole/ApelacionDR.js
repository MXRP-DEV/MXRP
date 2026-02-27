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
  customId: 'ApelacionDR',

  /**
   * @param {ModalSubmitInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, user, fields } = interaction;

    const pregunta = fields.getTextInputValue('pregunta_dr');
    const fechaBaneo = fields.getTextInputValue('fecha_hora_baneo');
    const servidorBaneo = fields.getTextInputValue('servidor_baneo');
    const infoRoblox = fields.getTextInputValue('info_roblox');
    const razonBaneo = fields.getTextInputValue('razon_baneo') || 'No especificada';

    await interaction.deferReply({ flags: 'Ephemeral' });

    const setup = await CacheManager.getTicketSetupDR(guild.id);

    if (!setup) {
      return interaction.editReply({
        content: 'El sistema de tickets DR no está configurado.',
      });
    }

    const categoryId = setup.Unbans;

    if (!categoryId) {
      return interaction.editReply({
        content: 'No se encontró una categoría asignada para solicitudes de un-ban.',
      });
    }

    const category = guild.channels.cache.get(categoryId);
    if (!category || category.type !== ChannelType.GuildCategory) {
      return interaction.editReply({
        content: 'La categoría configurada no es válida.',
      });
    }

    // Contador de tickets
    const ticketName = `🎫┋${user.username}`.toLowerCase().replace(/ /g, '-');

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
        {
          id: setup.Supervisor,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
            PermissionsBitField.Flags.ManageChannels,
          ],
        },
        {
          id: setup.SupGeneral,
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

    const textContent = `🎫 **Solicitud de Un-ban - DR**

Estimado: <@${user.id}>, un miembro de <@&${setup.SpInterno}>, <@&${setup.Supervisor}> y <@&${setup.SupGeneral}> pronto te atenderá.

-# Actuamos porque queremos un mejor Departamento de Rol.
-# Ayúdanos a ser mejores.

**Información del Ticket**
• **Tipo:** Solicitud de Un-ban
• **Solicitante:** ${user.tag}
• **Fecha:** <t:${createdAt}:R>

**Solicitud:**
${pregunta}

**Detalles Adicionales:**
• **Fecha de Baneo:** ${fechaBaneo}
• **Servidor:** ${servidorBaneo}
• **Info Roblox:** ${infoRoblox}
• **Razón del Baneo:** ${razonBaneo}

• Creado: <t:${createdAt}:R>`;

    const container = new ContainerBuilder()
      .setAccentColor(0xff7700)
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

    // Guardar ticket en la base de datos
    await TicketUserDR.create({
      GuildId: guild.id,
      ChannelId: channel.id,
      TicketId: ticketName,
      CreadorId: user.id,
      Categoria: 'unban',
    });
  },
};
