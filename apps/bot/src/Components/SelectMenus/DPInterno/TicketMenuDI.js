import { StringSelectMenuInteraction } from 'discord.js';
import { createTicketModal } from '#utils/createTicketModal.js';

export default {
  customId: 'PanelDI-Tickets',

  /**
   * @param {StringSelectMenuInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { values } = interaction;
    const SelectedOption = values[0];

    const ModalMap = {
      solicitar_capacitacion: {
        id: 'CapacitacionDI',
        title: 'Solicitud de Capacitación',
        files: false,
      },
      gestion_horas: {
        id: 'GestionHorasDI',
        title: 'Gestión de Horas',
        files: false,
      },
      gestion_informes: {
        id: 'GestionInformesDI',
        title: 'Gestión de Informes',
        files: true,
      },
      solicitar_inactividad: {
        id: 'InactividadDI',
        title: 'Solicitud de Inactividad',
        files: false,
      },
      apelaciones: {
        id: 'ApelacionesDI',
        title: 'Apelaciones - WIPs, Despidos, Applications',
        files: true,
      },
      apelacion_bl: {
        id: 'ApelacionBLDI',
        title: 'Apelación Blacklist',
        files: true,
      },
      otros: {
        id: 'OtrosDI',
        title: 'Otros',
        files: true,
      },
      ingreso_staff: {
        id: 'IngresoStaffDI',
        title: 'Ingreso a Staff',
        files: false,
      },
      reporte_staff: {
        id: 'ReporteStaffDI',
        title: 'Reporte de Staff',
        files: true,
      },
    };

    const ModalData = ModalMap[SelectedOption];
    if (!ModalData)
      return interaction.reply({ content: 'Categoría inválida.', flags: 'Ephemeral' });

    const modal = createTicketModal({
      id: ModalData.id,
      title: ModalData.title,
      includeFiles: ModalData.files,
    });

    await interaction.showModal(modal);
  },
};
