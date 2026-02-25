import { ChatInputCommandInteraction } from 'discord.js';
import { createInformeModal } from '#utils/createInformeModal.js';
import { COMMAND_SCOPES } from '#config/guilds.js';

export default {
  subCommand: 'informes.gp1',
  scope: COMMAND_SCOPES.MXRPVA,

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const modal = createInformeModal({
      id: 'InformeGP1',
      title: '📋 Informe Semanal GP1',
      tipo: 'gp1',
    });

    await interaction.showModal(modal);
  },
};
