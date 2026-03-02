import {
  ModalSubmitInteraction,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  SeparatorSpacingSize,
} from 'discord.js';
import { createTicketChannel } from '#utils/MXRP/createTicketChannel.js';
import { CacheManager } from '#utils/CacheManager.js';

export default {
  customId: 'ReporteAnonimoMXRP',
  /**
   * @param {ModalSubmitInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { fields, guild, user } = interaction;
    const motivo = fields.getTextInputValue('Reason');
    const metodo = fields.fields.get('metodo')?.values?.[0] || 'Ticket';
    const tipo = fields.fields.get('tipo')?.values?.[0] || 'ReporteUsuario';
    const reportadoId = fields.fields.get('reportado')?.values?.[0]; // Obtener ID del usuario reportado

    let reportadoInfo = 'N/A';
    let reportadoPing = '';

    if (reportadoId) {
      try {
        const reportedUser = await client.users.fetch(reportadoId);
        reportadoInfo = `${reportedUser.tag} (<@${reportedUser.id}>)`;
        // No hacemos ping real al usuario reportado, solo mostramos su mención en texto
      } catch {
        reportadoInfo = `ID: ${reportadoId} (Usuario no encontrado)`;
      }
    }

    // Si selecciona DM, no se crea ticket, se envía al canal de anonimato
    if (metodo === 'DM') {
      await interaction.deferReply({ flags: 'Ephemeral' });

      const setup = await CacheManager.getTicketSetupMXRP(guild.id);

      if (!setup || !setup.AnonimoChannel) {
        return interaction.editReply({
          content: 'Error: El canal de reportes anónimos no está configurado.',
        });
      }

      const anonimoChannel = guild.channels.cache.get(setup.AnonimoChannel);
      if (!anonimoChannel) {
        return interaction.editReply({
          content: 'Error: No se encontró el canal de reportes anónimos.',
        });
      }

      // Obtener roles para ping (AsuntosInternos y RH)
      const perms = await CacheManager.getTicketPermisosMXRP(guild.id);
      const rolesToPing = [];
      if (perms?.AsuntosInternos) rolesToPing.push(perms.AsuntosInternos);
      if (perms?.RH) rolesToPing.push(perms.RH);

      const pingContent = rolesToPing.map((id) => `<@&${id}>`).join(' ');
      const createdAt = Math.floor(Date.now() / 1000);

      const textContent = `🕵️ **Nuevo Reporte Anónimo (Vía DM)**

**Información del Reporte**
• **Usuario:** <@${user.id}> (${user.tag})
• **Reportado:** ${reportadoInfo}
• **Tipo:** ${tipo}
• **Fecha:** <t:${createdAt}:R>

**Motivo:**
${motivo}`;

      const container = new ContainerBuilder()
        .setAccentColor(0x2f3136) // NotQuiteBlack-ish
        .addSectionComponents((section) =>
          section
            .addTextDisplayComponents((text) => text.setContent(textContent))
            .setThumbnailAccessory((thumb) =>
              thumb.setURL(user.displayAvatarURL({ size: 1024, extension: 'png' }))
            )
        )
        .addSeparatorComponents((sep) =>
          sep.setSpacing(SeparatorSpacingSize.Small).setDivider(true)
        )
        .addActionRowComponents((row) =>
          row.addComponents(
            new ButtonBuilder()
              .setCustomId(`AtenderAnonimoMXRP:${user.id}`) // Pasamos el ID del usuario en el customId
              .setLabel('Atender (Abrir ModMail)')
              .setStyle(ButtonStyle.Success)
              .setEmoji('📩')
          )
        );

      // Enviar primero el ping si existe
      if (pingContent) {
        await anonimoChannel.send({ content: pingContent });
      }

      // Enviar el contenedor (V2) por separado
      await anonimoChannel.send({
        flags: 'IsComponentsV2',
        components: [container],
      });

      return interaction.editReply({
        content:
          '✅ Tu solicitud de reporte anónimo ha sido enviada. Un miembro del staff te contactará por DM pronto.',
      });
    }

    // Si es vía Ticket, flujo normal
    // Pasamos el usuario reportado en la descripción para que createTicketChannel lo maneje (aunque idealmente debería ser parámetro)
    // Pero como createTicketChannel es genérico, lo meteremos en la descripción.
    const description = `**Motivo:** ${motivo}\n**Contacto:** ${metodo}\n**Tipo seleccionado:** ${tipo}\n**Usuario Reportado:** ${reportadoInfo}`;

    await createTicketChannel({
      interaction,
      client,
      categoryKey: 'ReporteAnonimo',
      title: 'Reporte Anónimo',
      description,
    });
  },
};
