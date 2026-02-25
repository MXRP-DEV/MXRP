import { ChatInputCommandInteraction } from 'discord.js';
import { createInformeModal } from '#utils/createInformeModal.js';
import { COMMAND_SCOPES } from '#config/guilds.js';

export default {
  subCommand: 'informes.gp2',
  scope: COMMAND_SCOPES.MXRPVA,

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const modal = createInformeModal({
      id: 'InformeGP2',
      title: '📋 Informe Semanal GP2',
      tipo: 'gp2',
    });

    await interaction.showModal(modal);
  },
};
