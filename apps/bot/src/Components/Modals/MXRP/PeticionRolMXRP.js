import { ModalSubmitInteraction } from 'discord.js';
import { createTicketChannel } from '#utils/MXRP/createTicketChannel.js';

export default {
  customId: 'PeticionRolMXRP',
  async execute(interaction, client) {
    const { fields } = interaction;
    const rol = fields.getTextInputValue('Rol');
    const motivo = fields.getTextInputValue('Reason');
    const description = `**Rol Solicitado:** ${rol}\n**Justificación:** ${motivo}`;
    await createTicketChannel({
      interaction,
      client,
      categoryKey: 'Peticion',
      title: 'Petición de Rol',
      description,
    });
  },
};
