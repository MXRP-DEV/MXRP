import { ModalSubmitInteraction } from 'discord.js';
import { createTicketChannel } from '#utils/MXRP/createTicketChannel.js';

export default {
  customId: 'CKMXRP',
  /**
   * @param {ModalSubmitInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { fields } = interaction;
    const usuario = fields.getTextInputValue('CK');
    const avanzado = fields.getTextInputValue('Avanzado');
    const plan = fields.getTextInputValue('Logracion');
    const objetivo = fields.getTextInputValue('UserCK');
    const description = `**Usuario:** ${usuario}\n**Avanzado:** ${avanzado}\n**Plan:** ${plan}\n**Objetivo:** ${objetivo}`;
    await createTicketChannel({
      interaction,
      client,
      categoryKey: 'CK',
      title: 'Solicitud de CK',
      description,
    });
  },
};
