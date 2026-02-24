import { ModalSubmitInteraction, ContainerBuilder, SeparatorSpacingSize } from 'discord.js';
import ApelacionDespidoDI from '#database/models/DPInterno/ApelacionDespidoDI.js';

export default {
  customId: 'apelar-despido',
  /**
   * @param {ModalSubmitInteraction} interaction
   * @param {Client} client
   */

  async execute(interaction, client) {
    const { guild, user, fields } = interaction;

    const staffDespedido = fields.getSelectedUsers('Staff-despedido').first();
    const staffAplicador = fields.getSelectedUsers('Staff-aplicador').first();
    const staffApela = fields.getSelectedUsers('StaffApela').first();

    const Motivo = fields.getTextInputValue('Motivo');
    const Compromiso = fields.getTextInputValue('Compromiso');

    await interaction.deferReply({ flags: 'Ephemeral' });

    const config = await ApelacionDespidoDI.findOne({ GuildId: guild.id });

    if (!config) {
      return interaction.editReply({
        content: 'El sistema de apelaciones de despidos no está configurado.',
      });
    }

    const canalId = config.CanalId;

    if (!canalId) {
      return interaction.editReply({
        content: 'No se encontró un canal configurado para apelaciones de despidos.',
      });
    }

    const canalDestino = guild.channels.cache.get(canalId);
    if (!canalDestino) {
      return interaction.editReply({
        content: 'El canal configurado para apelaciones no existe o no es accesible.',
      });
    }

    const textContent = `<@&${config.RHRolId}>
⚖️ **Apelación de Despido**

**Información de la Apelación**
• **Staff Despedido:** <@${staffDespedido.id}>
• **Staff que Aplicó el Despido:** <@${staffAplicador.id}>
• **Staff que Apela:** <@${staffApela.id}>

**Motivo de la Apelación:**
${Motivo}

**Compromiso del Apelante:**
${Compromiso}

**Estado:** Pendiente de revisión
• Creado: <t:${Math.floor(Date.now() / 1000)}:R>`;

    const container = new ContainerBuilder()
      .setAccentColor(0xff9900)
      .addSectionComponents((section) =>
        section
          .addTextDisplayComponents((text) => text.setContent(textContent))
          .setThumbnailAccessory((thumb) =>
            thumb.setURL(client.user.displayAvatarURL({ size: 1024, extension: 'png' }))
          )
      )
      .addSeparatorComponents((sep) => sep.setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addSeparatorComponents((sep) => sep.setSpacing(SeparatorSpacingSize.Large).setDivider(true));

    await canalDestino.send({
      flags: 'IsComponentsV2',
      components: [container],
    });

    await interaction.editReply({
      content: `Tu apelación de despido ha sido enviada exitosamente al canal ${canalDestino}.`,
    });
  },
};
