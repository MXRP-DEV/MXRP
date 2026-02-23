import { EmbedBuilder } from 'discord.js';
import { logger } from '#functions/Logger.js';

export class BackupManager {
  constructor(client) {
    this.client = client;
    this.backupClient = client.backupClient;
  }

  async createBackup(guild, options = {}) {
    try {
      const defaultOptions = {
        maxMessagesPerChannel: 50,
        jsonSave: true,
        jsonBeautify: true,
        doNotBackup: [],
        backupMembers: true,
        saveImages: 'base64',
        skipIfUnchanged: true,
        ...options,
      };

      const backupData = await this.backupClient.create(guild, defaultOptions);

      logger.info(`[Backup] Created backup ${backupData.id} for guild ${guild.id}`);

      return {
        success: true,
        backup: backupData,
        embed: this.createBackupEmbed(backupData, 'created'),
      };
    } catch (error) {
      logger.error('[Backup] Error creating backup:', error);
      return {
        success: false,
        error: error.message,
        embed: this.createErrorEmbed('Error al crear backup', error.message),
      };
    }
  }

  async loadBackup(backupId, guild, options = {}) {
    try {
      const defaultOptions = {
        clearGuildBeforeRestore: true,
        maxMessagesPerChannel: 50,
        allowedMentions: { parse: [] },
        restoreMembers: true,
        ...options,
      };

      await this.backupClient.load(backupId, guild, defaultOptions);

      logger.info(`[Backup] Loaded backup ${backupId} for guild ${guild.id}`);

      return {
        success: true,
        embed: this.createBackupEmbed({ id: backupId }, 'loaded'),
      };
    } catch (error) {
      logger.error('[Backup] Error loading backup:', error);
      return {
        success: false,
        error: error.message,
        embed: this.createErrorEmbed('Error al cargar backup', error.message),
      };
    }
  }

  async listBackups() {
    try {
      const backupIds = await this.backupClient.list();

      logger.info(`[Backup] Listed ${backupIds.length} backups`);

      return {
        success: true,
        backups: backupIds,
        embed: this.createListEmbed(backupIds),
      };
    } catch (error) {
      logger.error('[Backup] Error listing backups:', error);
      return {
        success: false,
        error: error.message,
        embed: this.createErrorEmbed('Error al listar backups', error.message),
      };
    }
  }

  async listAllBackups() {
    try {
      const backupIds = await this.backupClient.list();

      // Enriquecer los datos con información adicional para autocompletado
      const enrichedBackups = backupIds.map((backupId, index) => ({
        backupId,
        name: `Backup #${index + 1}`,
        date: new Date().toLocaleDateString(), // Podríamos obtener la fecha real del backup
        index: index + 1,
      }));

      return enrichedBackups;
    } catch (error) {
      logger.error('[Backup] Error listing all backups for autocomplete:', error);
      return [];
    }
  }

  async getBackupInfo(backupId) {
    try {
      const info = await this.backupClient.fetch(backupId);

      logger.info(`[Backup] Fetched info for backup ${backupId}`);

      return {
        success: true,
        info,
        embed: this.createInfoEmbed(info),
      };
    } catch (error) {
      logger.error('[Backup] Error fetching backup info:', error);
      return {
        success: false,
        error: error.message,
        embed: this.createErrorEmbed('Error al obtener información del backup', error.message),
      };
    }
  }

  async removeBackup(backupId) {
    try {
      await this.backupClient.remove(backupId);

      logger.info(`[Backup] Removed backup ${backupId}`);

      return {
        success: true,
        embed: this.createBackupEmbed({ id: backupId }, 'removed'),
      };
    } catch (error) {
      logger.error('[Backup] Error removing backup:', error);
      return {
        success: false,
        error: error.message,
        embed: this.createErrorEmbed('Error al eliminar backup', error.message),
      };
    }
  }

  async compareBackups(oldBackupId, newBackupId) {
    try {
      const diff = await this.backupClient.diff(oldBackupId, newBackupId);

      logger.info(`[Backup] Compared backups ${oldBackupId} vs ${newBackupId}`);

      return {
        success: true,
        diff,
        embed: this.createDiffEmbed(diff, oldBackupId, newBackupId),
      };
    } catch (error) {
      logger.error('[Backup] Error comparing backups:', error);
      return {
        success: false,
        error: error.message,
        embed: this.createErrorEmbed('Error al comparar backups', error.message),
      };
    }
  }

  createBackupEmbed(backupData, action) {
    const embed = new EmbedBuilder()
      .setTitle('🔄 Sistema de Backups')
      .setTimestamp()
      .setColor('Blurple');

    switch (action) {
      case 'created':
        embed
          .setDescription('✅ Backup creado exitosamente')
          .addFields(
            { name: '🆔 ID del Backup', value: `\`${backupData.id}\``, inline: true },
            { name: '📊 Tamaño', value: `${Math.round(backupData.size / 1024)} KB`, inline: true },
            { name: '📅 Fecha', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
          )
          .setColor('Green');
        break;

      case 'loaded':
        embed
          .setDescription('✅ Backup cargado exitosamente')
          .addFields(
            { name: '🆔 ID del Backup', value: `\`${backupData.id}\``, inline: true },
            { name: '📅 Cargado', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
          )
          .setColor('Green');
        break;

      case 'removed':
        embed
          .setDescription('🗑️ Backup eliminado exitosamente')
          .addFields(
            { name: '🆔 ID del Backup', value: `\`${backupData.id}\``, inline: true },
            { name: '📅 Eliminado', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
          )
          .setColor('Orange');
        break;

      default:
        embed.setDescription('✅ Operación completada');
    }

    return embed;
  }

  createListEmbed(backupIds) {
    const embed = new EmbedBuilder()
      .setTitle('📋 Lista de Backups')
      .setDescription(`Se encontraron **${backupIds.length}** backups`)
      .setColor('Blurple')
      .setTimestamp();

    if (backupIds.length > 0) {
      const backupList = backupIds
        .slice(0, 10)
        .map((id, index) => `${index + 1}. \`${id}\``)
        .join('\n');

      embed.addFields({
        name: '📁 Backups Disponibles',
        value: backupList + (backupIds.length > 10 ? `\n\n... y ${backupIds.length - 10} más` : ''),
      });
    } else {
      embed.setDescription('❌ No se encontraron backups');
    }

    return embed;
  }

  createInfoEmbed(info) {
    const embed = new EmbedBuilder()
      .setTitle('ℹ️ Información del Backup')
      .addFields(
        { name: '🆔 ID', value: `\`${info.id}\``, inline: true },
        { name: '📊 Tamaño', value: `${Math.round(info.size / 1024)} KB`, inline: true },
        { name: '📅 Creado', value: `<t:${Math.floor(info.created / 1000)}:R>`, inline: true }
      )
      .setColor('Blurple')
      .setTimestamp();

    if (info.data) {
      const stats = [];
      if (info.data.roles) stats.push(`🎭 Roles: ${info.data.roles.length}`);
      if (info.data.channels) stats.push(`📢 Canales: ${info.data.channels.length}`);
      if (info.data.emojis) stats.push(`😀 Emojis: ${info.data.emojis.length}`);
      if (info.data.bans) stats.push(`🔨 Baneos: ${info.data.bans.length}`);
      if (info.data.members) stats.push(`👥 Miembros: ${info.data.members.length}`);

      if (stats.length > 0) {
        embed.addFields({
          name: '📈 Estadísticas',
          value: stats.join('\n'),
        });
      }
    }

    return embed;
  }

  createDiffEmbed(diff, oldId, newId) {
    const embed = new EmbedBuilder()
      .setTitle('🔍 Comparación de Backups')
      .addFields(
        { name: '🆔 Backup Antiguo', value: `\`${oldId}\``, inline: true },
        { name: '🆔 Backup Nuevo', value: `\`${newId}\``, inline: true }
      )
      .setColor('Blurple')
      .setTimestamp();

    const changes = [];

    if (diff.configChanged) changes.push('⚙️ Configuración');
    if (diff.roles && diff.roles.length > 0) changes.push(`🎭 Roles (${diff.roles.length})`);
    if (diff.channels && diff.channels.length > 0)
      changes.push(`📢 Canales (${diff.channels.length})`);
    if (diff.emojis && diff.emojis.length > 0) changes.push(`😀 Emojis (${diff.emojis.length})`);
    if (diff.bans && diff.bans.length > 0) changes.push(`🔨 Baneos (${diff.bans.length})`);
    if (diff.members && diff.members.length > 0)
      changes.push(`👥 Miembros (${diff.members.length})`);

    if (changes.length > 0) {
      embed.addFields({
        name: '🔄 Cambios Detectados',
        value: changes.join('\n'),
      });
    } else {
      embed.addFields({
        name: '✅ Sin Cambios',
        value: 'No se detectaron diferencias entre los backups',
      });
    }

    return embed;
  }

  createErrorEmbed(title, error) {
    return new EmbedBuilder()
      .setTitle('❌ Error del Sistema de Backups')
      .setDescription(`**${title}**\n\`${error}\``)
      .setColor('Red')
      .setTimestamp();
  }
}

export function getBackupManager(client) {
  if (!client.backupManager) {
    client.backupManager = new BackupManager(client);
  }
  return client.backupManager;
}
