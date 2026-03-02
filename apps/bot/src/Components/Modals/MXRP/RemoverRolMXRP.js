import { ModalSubmitInteraction } from 'discord.js';
import { createTicketChannel } from '#utils/MXRP/createTicketChannel.js';

export default {
  customId: 'RemoverRolMXRP',
  async execute(interaction, client) {
    const { fields } = interaction;
    const rol = fields.getTextInputValue('Rol');
    const motivo = fields.getTextInputValue('Reason');
    const description = `**Rol:** ${rol}\n**Motivo:** ${motivo}`;
    await createTicketChannel({
      interaction,
      client,
      categoryKey: 'RemoverRol',
      title: 'Remoción de Rol',
      description,
    });
  },
};
