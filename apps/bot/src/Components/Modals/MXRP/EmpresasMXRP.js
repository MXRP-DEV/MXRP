import { ModalSubmitInteraction } from 'discord.js';
import { createTicketChannel } from '#utils/MXRP/createTicketChannel.js';

export default {
  customId: 'EmpresasMXRP',
  async execute(interaction, client) {
    const { fields } = interaction;
    const nombre = fields.getTextInputValue('Nombre');
    const dueno = fields.getTextInputValue('Dueño');
    const description = `**Empresa:** ${nombre}\n**Dueño:** ${dueno}`;
    await createTicketChannel({
      interaction,
      client,
      categoryKey: 'Empresas',
      title: 'Empresas',
      description,
    });
  },
};
