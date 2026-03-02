import { ModalSubmitInteraction } from 'discord.js';
import { createTicketChannel } from '#utils/MXRP/createTicketChannel.js';

export default {
  customId: 'SoporteMXRP',
  /**
   * @param {ModalSubmitInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { fields } = interaction;
    const asunto = fields.getTextInputValue('asunto_ticket');
    const descripcion = fields.getTextInputValue('descripcion_ticket');

    const description = `**Asunto:** ${asunto}\n**Descripción:** ${descripcion}`;
    await createTicketChannel({
      interaction,
      client,
      categoryKey: 'SoporteTecnico',
      title: 'Soporte Técnico',
      description,
    });
  },
};
