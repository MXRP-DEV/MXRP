import { StringSelectMenuInteraction } from 'discord.js';
import { createTicketModalMXRP } from '#utils/createTicketModalMXRP.js';

export default {
  customId: 'TicketMenu2',
  /**
   * @param {StringSelectMenuInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { values } = interaction;
    const SelectedOption = values[0];

    const ModalMap = {
      SoporteP: { id: 'SoportePrioritarioMXRP', title: 'Soporte Prioritario', type: 'SoportePrioritario' },
      SoporteVip: { id: 'SoporteVipMXRP', title: 'Soporte VIP', type: 'SoporteVip' },
    };

    const ModalData = ModalMap[SelectedOption];
    if (!ModalData) {
      return interaction.reply({ content: 'Categoría inválida.', flags: 'Ephemeral' });
    }

    const modal = createTicketModalMXRP(ModalData);
    await interaction.showModal(modal);
  },
};
