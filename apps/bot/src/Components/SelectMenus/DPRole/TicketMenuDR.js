import { StringSelectMenuInteraction } from 'discord.js';
import { createTicketModalDR } from '#utils/createTicketModalDR.js';

export default {
  customId: 'PanelDR-Tickets',

  /**
   * @param {StringSelectMenuInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { values } = interaction;
    const SelectedOption = values[0];

    const ModalMap = {
      dr_unban: {
        id: 'ApelacionDR',
        title: '🎫 Ticket | Solicitud Un-Ban',
        type: 'apelacion',
      },
      dr_reporte: {
        id: 'ReporteDR',
        title: '🚫 Ticket | Reporte DR',
        type: 'reporte',
      },
      dr_otros: {
        id: 'OtrosDR',
        title: '➕ Ticket | Otros DR',
        type: 'otros',
      },
    };

    const ModalData = ModalMap[SelectedOption];

    if (!ModalData)
      return interaction.reply({
        content: 'Categoría inválida.',
        flags: 'Ephemeral',
      });

    const modal = createTicketModalDR({
      id: ModalData.id,
      title: ModalData.title,
      type: ModalData.type,
    });

    await interaction.showModal(modal);
  },
};
