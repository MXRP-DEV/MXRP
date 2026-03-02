import { ModalSubmitInteraction } from 'discord.js';
import { createTicketChannel } from '#utils/MXRP/createTicketChannel.js';

export default {
  customId: 'QuejasMXRP',
  /**
   * @param {ModalSubmitInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { fields } = interaction;
    const asunto = fields.getTextInputValue('Reason');
    const detalles = fields.getTextInputValue('Details');
    const description = `**Asunto:** ${asunto}\n**Detalle:** ${detalles}`;
    await createTicketChannel({
      interaction,
      client,
      categoryKey: 'Quejas',
      title: 'Queja / Pregunta',
      description,
    });
  },
};
