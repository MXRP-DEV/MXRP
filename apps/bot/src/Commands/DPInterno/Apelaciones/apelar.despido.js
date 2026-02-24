import {
  ChatInputCommandInteraction,
  ModalBuilder,
  LabelBuilder,
  UserSelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import ApelacionDespidoDI from '#database/models/DPInterno/ApelacionDespidoDI.js';

export default {
  subCommand: 'apelar.despido',
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, member } = interaction;

    const config = await ApelacionDespidoDI.findOne({ GuildId: guild.id });

    if (!config) {
      return interaction.reply({
        content:
          'El sistema de apelaciones de despidos no está configurado. Contacta a un administrador.',
        flags: 'Ephemeral',
      });
    }

    if (!member.roles.cache.has(config.PermisoRoleId)) {
      return interaction.reply({
        content: 'No tienes permiso para crear apelaciones de despidos.',
        flags: 'Ephemeral',
      });
    }

    const Modal = new ModalBuilder()
      .setTitle('Formato de apelación - Despido')
      .setCustomId('apelar-despido')
      .addLabelComponents(
        new LabelBuilder()
          .setLabel('Staff despedido')
          .setDescription('Selecciona al miembro del staff que fue despedido')
          .setUserSelectMenuComponent(
            new UserSelectMenuBuilder()
              .setCustomId('Staff-despedido')
              .setPlaceholder('Selecciona al staff despedido')
              .setMinValues(1)
              .setMaxValues(1)
              .setRequired(true)
          ),

        new LabelBuilder()
          .setLabel('Staff que aplicó el despido')
          .setDescription('Selecciona al staff responsable de aplicar el despido')
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
          .setDescription('Explica por qué deseas apelar el despido')
          .setTextInputComponent(
            new TextInputBuilder()
              .setCustomId('Motivo')
              .setPlaceholder('Ejemplo: Considero que el despido fue injustificado')
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(true)
          ),

        new LabelBuilder()
          .setLabel('Staff que apela')
          .setDescription('Selecciona al staff que está realizando la apelación')
          .setUserSelectMenuComponent(
            new UserSelectMenuBuilder()
              .setCustomId('StaffApela')
              .setPlaceholder('Selecciona al staff apelante')
              .setMinValues(1)
              .setMaxValues(1)
              .setRequired(true)
          ),

        new LabelBuilder()
          .setLabel('Compromiso del apelante')
          .setDescription(
            'Indica a qué se compromete el staff en caso de ser aceptada la apelación'
          )
          .setTextInputComponent(
            new TextInputBuilder()
              .setCustomId('Compromiso')
              .setPlaceholder('Ejemplo: Mejorar mi desempeño y evitar futuras faltas')
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
          )
      );

    await interaction.showModal(Modal);
  },
};
