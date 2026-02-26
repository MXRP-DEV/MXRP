import { StringSelectMenuInteraction } from 'discord.js';
import { createTicketModal } from '#utils/createTicketModal.js';
import TicketSetupVA from '#database/models/DPVinculacion/TicketSetupVA.js';

export default {
  customId: 'PanelVA-Tickets',

  /**
   * @param {StringSelectMenuInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { values } = interaction;
    const SelectedOption = values[0];

    const ModalMap = {
      apelar_ban: {
        id: 'ApelacionBanVA',
        title: 'Apelación de Ban',
        files: true,
      },
      aclaraciones: {
        id: 'AclaracionesVA',
        title: 'Aclaraciones',
        files: false,
      },
      vip: {
        id: 'SoporteVipVA',
        title: 'Soporte VIP',
        files: false,
      },
      reporte: {
        id: 'ReporteGeneralVA',
        title: 'Reporte General',
        files: true,
      },
      reporte_va: {
        id: 'ReporteVA',
        title: 'Reporte Vinculación Administrativa',
        files: true,
      },
    };

    const ModalData = ModalMap[SelectedOption];
    if (!ModalData)
      return interaction.reply({
        content: 'Categoría inválida.',
        flags: 'Ephemeral',
      });

    const modal = createTicketModal({
      id: ModalData.id,
      title: ModalData.title,
      includeFiles: ModalData.files,
    });

    await interaction.showModal(modal);
  },
};
