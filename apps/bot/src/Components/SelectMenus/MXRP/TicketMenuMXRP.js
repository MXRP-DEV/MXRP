import { StringSelectMenuInteraction } from 'discord.js';
import { createTicketModalMXRP } from '#utils/createTicketModalMXRP.js';

export default {
  customId: 'TicketMenu',
  /**
   * @param {StringSelectMenuInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { values } = interaction;
    const SelectedOption = values[0];

    const ModalMap = {
      Hosting: { id: 'HostingMXRP', title: 'MXRP Bot Hosting', type: 'Hosting' },
      ReportUser: { id: 'ReporteUsuarioMXRP', title: 'Reporte a Usuarios', type: 'ReporteUsuario' },
      Anonimo: { id: 'ReporteAnonimoMXRP', title: 'Reporte Anónimo', type: 'ReporteAnonimo' },
      Rol_Add: { id: 'PeticionRolMXRP', title: 'Petición de Rol', type: 'Peticion' },
      Warn: { id: 'WarnMXRP', title: 'Solicitud Remoción de Warn', type: 'Warn' },
      CK: { id: 'CKMXRP', title: 'Solicitud de CK', type: 'CK' },
      Quejas: { id: 'QuejasMXRP', title: 'Queja / Pregunta', type: 'Quejas' },
      Staff: { id: 'ReporteStaffMXRP', title: 'Reporte al Staff', type: 'ReporteStaff' },
      RemRol: { id: 'RemoverRolMXRP', title: 'Remoción de Rol', type: 'RemoverRol' },
      Otros: { id: 'OtrosMXRP', title: 'Otros', type: 'Otros' },
      Soporte: { id: 'SoporteMXRP', title: 'Soporte Técnico', type: 'Soporte' },
      Diseñadores: { id: 'DisenadoresMXRP', title: 'Diseñadores', type: 'Disenadores' },
      Reclamar: { id: 'ReclamarMXRP', title: 'Reclamar Recompensas/Robux', type: 'Reclamar' },
      Servicios: { id: 'ServiciosMXRP', title: 'Servicios MXRP', type: 'Servicios' },
      Rob_add: { id: 'RobosMXRP', title: 'Robos MXRP', type: 'Robos' },
      Liverys: { id: 'LiverysMXRP', title: 'Liverys', type: 'Liverys' },
      Compras: { id: 'ComprasMXRP', title: 'Compras', type: 'Compras' },
      ComprasIRL: { id: 'ComprasIRLMXRP', title: 'Compras IRL', type: 'ComprasIRL' },
      Facciones: { id: 'FaccionesMXRP', title: 'Departamento de Rol (Facciones)', type: 'Facciones' },
      Ine: { id: 'IneMXRP', title: 'Ine y Pasaporte', type: 'InePasaporte' },
      Empresas: { id: 'EmpresasMXRP', title: 'Empresas', type: 'Empresas' },
    };

    const ModalData = ModalMap[SelectedOption];
    if (!ModalData) {
      return interaction.reply({ content: 'Categoría inválida.', flags: 'Ephemeral' });
    }

    const modal = createTicketModalMXRP(ModalData);
    await interaction.showModal(modal);
  },
};
