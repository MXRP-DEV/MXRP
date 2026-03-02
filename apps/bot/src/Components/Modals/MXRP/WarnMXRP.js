import { ModalSubmitInteraction } from 'discord.js';
import { createTicketChannel } from '#utils/MXRP/createTicketChannel.js';

export default {
  customId: 'WarnMXRP',
  async execute(interaction, client) {
    const { fields } = interaction;
    const warn = fields.getTextInputValue('Warn');
    const details = fields.getTextInputValue('Details');
    const staff = fields.getTextInputValue('Staff');
    const description = `**Warn:** ${warn}\n**Detalles:** ${details}\n**Staff:** ${staff}`;
    await createTicketChannel({
      interaction,
      client,
      categoryKey: 'Warn',
      title: 'Remoción de Warn',
      description,
    });
  },
};
