import { SlashCommandBuilder, PermissionFlagsBits, ApplicationIntegrationType } from 'discord.js';
import { COMMAND_SCOPES } from '#config/guilds.js';
import autocompleteHandler from './Backups/backup.autocomplete.js';

export default {
  scope: COMMAND_SCOPES.DEV,
  data: new SlashCommandBuilder()
    .setName('backup')
    .setDescription('Gestiona las copias de seguridad del servidor')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall)
    .addSubcommand((sub) =>
      sub.setName('create').setDescription('Crea una copia de seguridad completa del servidor')
    )
    .addSubcommand((sub) =>
      sub
        .setName('load')
        .setDescription('Carga una copia de seguridad')
        .addStringOption((option) =>
          option
            .setName('id')
            .setDescription('ID del backup a cargar')
            .setAutocomplete(true)
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub.setName('list').setDescription('Muestra todos los backups disponibles')
    )
    .addSubcommand((sub) =>
      sub
        .setName('info')
        .setDescription('Muestra información de un backup específico')
        .addStringOption((option) =>
          option
            .setName('id')
            .setDescription('ID del backup')
            .setAutocomplete(true)
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('remove')
        .setDescription('Elimina un backup')
        .addStringOption((option) =>
          option
            .setName('id')
            .setDescription('ID del backup a eliminar')
            .setAutocomplete(true)
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('compare')
        .setDescription('Compara dos backups')
        .addStringOption((option) =>
          option
            .setName('old')
            .setDescription('ID del backup antiguo')
            .setAutocomplete(true)
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('new')
            .setDescription('ID del backup nuevo')
            .setAutocomplete(true)
            .setRequired(true)
        )
    ),

  autocomplete: autocompleteHandler.execute,
};
