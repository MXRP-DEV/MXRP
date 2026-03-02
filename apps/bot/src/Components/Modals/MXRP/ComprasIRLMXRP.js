import { ModalSubmitInteraction } from 'discord.js';
import { createTicketChannel } from '#utils/MXRP/createTicketChannel.js';

export default {
  customId: 'ComprasIRLMXRP',
  async execute(interaction, client) {
    const { fields } = interaction;
    const reason = fields.getTextInputValue('Reason');
    const details = fields.getTextInputValue('Details');
    const description = `**Compra IRL:** ${reason}\n**Detalle:** ${details}`;
    await createTicketChannel({
      interaction,
      client,
      categoryKey: 'ComprasIRL',
      title: 'Compras IRL',
      description,
    });
  },
};
