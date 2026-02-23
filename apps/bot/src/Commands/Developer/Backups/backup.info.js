import { ChatInputCommandInteraction } from 'discord.js';
import { getBackupManager } from '#functions/BackupManager.js';

export default {
  subCommand: 'backup.info',

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply({ flags: 'Ephemeral' });

    const { options } = interaction;
    const backupId = options.getString('id');

    const backupManager = getBackupManager(client);
    const result = await backupManager.getBackupInfo(backupId);

    await interaction.editReply({
      embeds: [result.embed],
    });
  },
};
