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
  subCommand: 'apelar.wip',
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, member } = interaction;

    const config = await CacheManager.getApelacionWIP(guild.id);

    if (!config) {
      return interaction.reply({
        content:
          'El sistema de apelaciones de WIPs no está configurado. Contacta a un administrador.',
        flags: 'Ephemeral',
      });
    }

    if (!member.roles.cache.has(config.PermisoRoleId)) {
      return interaction.reply({
        content: 'No tienes permiso para crear apelaciones de WIPs.',
        flags: 'Ephemeral',
      });
    }

    const Modal = new ModalBuilder()
      .setTitle('Formato de apelación - WIP')
      .setCustomId('apelar-wip')
      .addLabelComponents(
        new LabelBuilder()
          .setLabel('Usuario que apela la WIP')
          .setDescription('Selecciona al usuario que está apelando la WIP')
          .setUserSelectMenuComponent(
            new UserSelectMenuBuilder()
              .setCustomId('Usuario-apelante')
              .setPlaceholder('Selecciona al usuario apelante')
              .setMinValues(1)
              .setMaxValues(1)
              .setRequired(true)
          ),

        new LabelBuilder()
          .setLabel('Número de WIP')
          .setDescription('Indica el número de la WIP que deseas apelar')
          .setTextInputComponent(
            new TextInputBuilder()
              .setCustomId('NumeroWIP')
              .setPlaceholder('Ejemplo: 12')
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
          ),

        new LabelBuilder()
          .setLabel('Motivo de la apelación')
          .setDescription('Explica por qué consideras que la WIP debe ser apelada')
          .setTextInputComponent(
            new TextInputBuilder()
              .setCustomId('Motivo')
              .setPlaceholder('Ejemplo: La sanción fue aplicada de forma incorrecta')
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(true)
          ),

        new LabelBuilder()
          .setLabel('Staff que aplicó la WIP')
          .setDescription('Selecciona al staff responsable de aplicar la WIP')
          .setUserSelectMenuComponent(
            new UserSelectMenuBuilder()
              .setCustomId('Staff-aplicador')
              .setPlaceholder('Selecciona al staff aplicador')
              .setMinValues(1)
              .setMaxValues(1)
              .setRequired(true)
          ),

        new LabelBuilder()
          .setLabel('Sube evidencia')
          .setDescription('Sube archivos que respalden tu apelación')
          .setFileUploadComponent(
            new FileUploadBuilder()
              .setCustomId('Pruebas')
              .setMinValues(1)
              .setMaxValues(3)
              .setRequired(false)
          )
      );

    await interaction.showModal(Modal);
  },
};
