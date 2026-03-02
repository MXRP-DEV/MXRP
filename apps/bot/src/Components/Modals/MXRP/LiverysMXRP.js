import { ModalSubmitInteraction } from 'discord.js';
import { createTicketChannel } from '#utils/MXRP/createTicketChannel.js';

export default {
  customId: 'LiverysMXRP',
  async execute(interaction, client) {
    const { fields } = interaction;
    const modelo = fields.getTextInputValue('Vehicle_model');
    const faccion = fields.getTextInputValue('Faction');
    const description = `**Modelo:** ${modelo}\n**Facción/Empresa:** ${faccion}`;
    await createTicketChannel({
      interaction,
      client,
      categoryKey: 'Liverys',
      title: 'Solicitud Livery',
      description,
    });
  },
};
