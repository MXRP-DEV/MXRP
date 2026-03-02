import { ModalSubmitInteraction } from 'discord.js';
import { createTicketChannel } from '#utils/MXRP/createTicketChannel.js';

export default {
  customId: 'RobosMXRP',
  async execute(interaction, client) {
    const { fields } = interaction;
    const robado = fields.getTextInputValue('Robado');
    const extra = fields.getTextInputValue('Extra');
    const description = `**Usuario afectado:** ${robado}\n**Descripción del incidente:** ${extra}`;
    await createTicketChannel({
      interaction,
      client,
      categoryKey: 'Robos',
      title: 'Robos',
      description,
    });
  },
};
