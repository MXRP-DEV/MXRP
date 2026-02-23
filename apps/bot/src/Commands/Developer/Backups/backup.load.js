import { ChatInputCommandInteraction } from 'discord.js';
import { getBackupManager } from '#functions/BackupManager.js';

export default {
  subCommand: 'backup.load',

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply({ flags: 'Ephemeral' });

    const { guild, options } = interaction;
    const backupId = options.getString('id');

    const backupManager = getBackupManager(client);
    const result = await backupManager.loadBackup(backupId, guild);

    await interaction.editReply({
      embeds: [result.embed],
    });
  },
};
