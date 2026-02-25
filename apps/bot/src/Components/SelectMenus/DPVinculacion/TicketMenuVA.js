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
    const { values, member } = interaction;
    const SelectedOption = values[0];

    // Validar roles VIP para tickets de soporte VIP
    if (SelectedOption === 'vip') {
      const setup = await TicketSetupVA.findOne({ GuildId: interaction.guild.id });

      if (!setup) {
        return interaction.reply({
          content: 'El sistema de tickets no está configurado.',
          flags: 'Ephemeral',
        });
      }

      const hasVipRole = setup.VipRole && member.roles.cache.has(setup.VipRole);
      const hasPartnerRole = setup.PartnerRole && member.roles.cache.has(setup.PartnerRole);
      const hasInversorRole = setup.InversorRole && member.roles.cache.has(setup.InversorRole);

      if (!hasVipRole && !hasPartnerRole && !hasInversorRole) {
        return interaction.reply({
          content:
            'No tienes permiso para abrir tickets VIP. Este servicio es exclusivo para usuarios VIP, Partners o Inversores.',
          flags: 'Ephemeral',
        });
      }
    }

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
