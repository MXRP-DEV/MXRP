import { ModalSubmitInteraction } from 'discord.js';
import { createTicketChannel } from '#utils/MXRP/createTicketChannel.js';

export default {
  customId: 'ComprasMXRP',
  async execute(interaction, client) {
    const { fields } = interaction;
    const reason = fields.getTextInputValue('Reason');
    const details = fields.getTextInputValue('Details');
    const description = `**Compra:** ${reason}\n**Detalle:** ${details}`;
    await createTicketChannel({
      interaction,
      client,
      categoryKey: 'Compras',
      title: 'Compras MXRP',
      description,
    });
  },
};
