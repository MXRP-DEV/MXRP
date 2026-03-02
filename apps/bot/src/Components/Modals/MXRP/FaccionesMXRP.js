import { ModalSubmitInteraction } from 'discord.js';
import { createTicketChannel } from '#utils/MXRP/createTicketChannel.js';

export default {
  customId: 'FaccionesMXRP',
  async execute(interaction, client) {
    const { fields } = interaction;
    const nombre = fields.getTextInputValue('Faccion');
    const motivo = fields.getTextInputValue('Reason');
    const description = `**Nombre:** ${nombre}\n**Descripción:** ${motivo}`;
    await createTicketChannel({
      interaction,
      client,
      categoryKey: 'Facciones',
      title: 'Solicitud Facción/Empresa',
      description,
    });
  },
};
