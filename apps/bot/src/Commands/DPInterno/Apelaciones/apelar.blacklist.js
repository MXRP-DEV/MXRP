import {
  ChatInputCommandInteraction,
  ModalBuilder,
  LabelBuilder,
  UserSelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle,
  FileUploadBuilder,
} from 'discord.js';
import { CacheManager } from '#utils/CacheManager.js';

export default {
  subCommand: 'apelar.blacklist',
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, member } = interaction;

    const config = await CacheManager.getApelacionBlacklist(guild.id);

    if (!config) {
      return interaction.reply({
        content:
          'El sistema de apelaciones de blacklist no está configurado. Contacta a un administrador.',
        flags: 'Ephemeral',
      });
    }

    if (!member.roles.cache.has(config.PermisoRoleId)) {
      return interaction.reply({
        content: 'No tienes permiso para crear apelaciones de blacklist.',
        flags: 'Ephemeral',
      });
    }

    const Modal = new ModalBuilder()
      .setTitle('Formato de apelación - Blacklist')
      .setCustomId('apelar-blacklist')
      .addLabelComponents(
        new LabelBuilder()
          .setLabel('Usuario que apela la blacklist')
          .setDescription('Selecciona al usuario que está apelando la blacklist')
          .setUserSelectMenuComponent(
            new UserSelectMenuBuilder()
              .setCustomId('Usuario-apelante')
              .setPlaceholder('Selecciona al usuario apelante')
              .setMinValues(1)
              .setMaxValues(1)
              .setRequired(true)
          ),

        new LabelBuilder()
          .setLabel('Staff que aplicó la blacklist')
          .setDescription('Selecciona al staff responsable de aplicar la blacklist')
          .setUserSelectMenuComponent(
            new UserSelectMenuBuilder()
              .setCustomId('Staff-aplicador')
              .setPlaceholder('Selecciona al staff aplicador')
              .setMinValues(1)
              .setMaxValues(1)
              .setRequired(true)
          ),

        new LabelBuilder()
          .setLabel('Motivo de la apelación')
          .setDescription('Explica por qué consideras que la blacklist debe ser apelada')
          .setTextInputComponent(
            new TextInputBuilder()
              .setCustomId('Motivo')
              .setPlaceholder('Ejemplo: La sanción fue aplicada de forma incorrecta')
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(true)
          ),

        new LabelBuilder()
          .setLabel('Evidencia de la apelación')
          .setDescription('Sube archivos que respalden tu apelación')
          .setFileUploadComponent(
            new FileUploadBuilder()
              .setCustomId('Pruebas')
              .setMinValues(1)
              .setMaxValues(5)
              .setRequired(true)
          )
      );

    await interaction.showModal(Modal);
  },
};
