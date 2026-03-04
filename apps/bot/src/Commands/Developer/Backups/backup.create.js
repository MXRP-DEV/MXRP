import { ChatInputCommandInteraction } from 'discord.js';
import { getBackupManager } from '#functions/BackupManager.js';

export default {
  subCommand: 'backup.create',

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply({ flags: 'Ephemeral' });

    const { guild } = interaction;
    const backupManager = getBackupManager(client);
    const result = await backupManager.createBackup(guild);

    await interaction.editReply({
      embeds: [result.embed],
    });
  },
};
