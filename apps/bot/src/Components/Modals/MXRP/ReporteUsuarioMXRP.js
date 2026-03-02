import { ModalSubmitInteraction } from 'discord.js';
import { createTicketChannel } from '#utils/MXRP/createTicketChannel.js';

export default {
  customId: 'ReporteUsuarioMXRP',
  /**
   * @param {ModalSubmitInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { fields } = interaction;
    const reportado = fields.getTextInputValue('Reportado');
    const motivo = fields.getTextInputValue('Reason');

    const description = `**Reportado:** ${reportado}\n**Motivo:** ${motivo}`;
    await createTicketChannel({
      interaction,
      client,
      categoryKey: 'Reportes',
      title: 'Reporte de Usuario',
      description,
    });
  },
};
