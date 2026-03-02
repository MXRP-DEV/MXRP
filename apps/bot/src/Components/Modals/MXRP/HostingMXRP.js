import { ModalSubmitInteraction } from 'discord.js';
import { createTicketChannel } from '#utils/MXRP/createTicketChannel.js';

export default {
  customId: 'HostingMXRP',
  async execute(interaction, client) {
    const { fields } = interaction;
    const serverName = fields.getTextInputValue('ServerName');
    
    // Obtener valores de los menús desplegables
    const planType = fields.fields.get('PlanType')?.values?.[0] || 'No seleccionado';
    const maintenanceType = fields.fields.get('MaintenanceType')?.values?.[0] || 'No seleccionado';
    
    const requirements = fields.getTextInputValue('Requirements');
    const additional = fields.getTextInputValue('AdditionalInfo') ?? '';

    const description = `**Servidor/Facción:** ${serverName}\n**Plan:** ${planType}\n**Mantenimiento:** ${maintenanceType}\n**Requerimientos:** ${requirements}\n${additional ? `**Info adicional:** ${additional}` : ''}`;
    
    await createTicketChannel({
      interaction,
      client,
      categoryKey: 'Hosting',
      title: 'MXRP Bot Hosting',
      description,
    });
  },
};
