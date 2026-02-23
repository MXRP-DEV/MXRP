import { ChatInputCommandInteraction } from 'discord.js';
import { getBackupManager } from '#functions/BackupManager.js';

export default {
  subCommand: 'backup.compare',

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply({ flags: 'Ephemeral' });

    const { options } = interaction;
    const oldId = options.getString('old');
    const newId = options.getString('new');

    const backupManager = getBackupManager(client);
    const result = await backupManager.compareBackups(oldId, newId);

    await interaction.editReply({
      embeds: [result.embed],
    });
  },
};
