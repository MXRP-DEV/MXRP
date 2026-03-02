import { ModalSubmitInteraction } from 'discord.js';
import { createTicketChannel } from '#utils/MXRP/createTicketChannel.js';

export default {
  customId: 'IneMXRP',
  async execute(interaction, client) {
    const { fields } = interaction;
    const reason = fields.getTextInputValue('Reason');
    const details = fields.getTextInputValue('Details');
    const description = `**Solicitud:** ${reason}\n**Detalle:** ${details}`;
    await createTicketChannel({
      interaction,
      client,
      categoryKey: 'InePasaporte',
      title: 'Ine y Pasaporte',
      description,
    });
  },
};
