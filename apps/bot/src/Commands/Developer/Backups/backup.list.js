import { ChatInputCommandInteraction } from 'discord.js';
import { getBackupManager } from '#functions/BackupManager.js';

export default {
  subCommand: 'backup.list',

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply({ flags: 'Ephemeral' });

    const backupManager = getBackupManager(client);
    const result = await backupManager.listBackups();

    await interaction.editReply({
      embeds: [result.embed],
    });
  },
};
