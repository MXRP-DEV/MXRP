import { ModalSubmitInteraction } from 'discord.js';
import { createTicketChannel } from '#utils/MXRP/createTicketChannel.js';

export default {
  customId: 'ReporteStaffMXRP',
  /**
   * @param {ModalSubmitInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { fields } = interaction;
    const reportados = fields.getTextInputValue('Reportados');
    const denunciantes = fields.getTextInputValue('Denunciantes');
    const motivo = fields.getTextInputValue('Reason');

    const description = `**Staff reportado:** ${reportados}\n**Víctimas:** ${denunciantes}\n**Motivo:** ${motivo}`;
    await createTicketChannel({
      interaction,
      client,
      categoryKey: 'ReporteStaff',
      title: 'Reporte al Staff',
      description,
    });
  },
};
