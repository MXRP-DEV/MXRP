import { AutocompleteInteraction } from 'discord.js';
import { getBackupManager } from '#functions/BackupManager.js';

export default {
  name: 'backup',
  
  /**
   * @param {AutocompleteInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const focusedOption = interaction.options.getFocused(true);
    const subcommand = interaction.options.getSubcommand();
    
    const backupManager = getBackupManager(client);
    
    try {
      // Obtener todos los backups disponibles
      const backups = await backupManager.listAllBackups();
      
      if (!backups || backups.length === 0) {
        await interaction.respond([]);
        return;
      }
      
      let choices = [];
      
      // Filtrar según el focused option
      if (focusedOption.name === 'id') {
        choices = backups
          .filter(backup => 
            backup.backupId.toLowerCase().includes(focusedOption.value.toLowerCase()) ||
            backup.name?.toLowerCase().includes(focusedOption.value.toLowerCase())
          )
          .map(backup => ({
            name: `${backup.backupId} - ${backup.name || 'Sin nombre'} (${backup.date})`,
            value: backup.backupId
          }))
          .slice(0, 25); // Discord limit
      } else if (focusedOption.name === 'old' || focusedOption.name === 'new') {
        choices = backups
          .filter(backup => 
            backup.backupId.toLowerCase().includes(focusedOption.value.toLowerCase()) ||
            backup.name?.toLowerCase().includes(focusedOption.value.toLowerCase())
          )
          .map(backup => ({
            name: `${backup.backupId} - ${backup.name || 'Sin nombre'} (${backup.date})`,
            value: backup.backupId
          }))
          .slice(0, 25);
      }
      
      await interaction.respond(choices);
    } catch (error) {
      console.error('Error en autocompletado de backup:', error);
      await interaction.respond([]);
    }
  },
};
