import {
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  LabelBuilder,
} from 'discord.js';

export default {
  customId: 'CloseDI',

  /**
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const Modal = new ModalBuilder()
      .setCustomId('CierreDI')
      .setTitle('Cierre de Ticket')
      .addLabelComponents(
        new LabelBuilder()
          .setLabel('Razón del cierre')
          .setTextInputComponent(
            new TextInputBuilder()
              .setCustomId('Razon')
              .setPlaceholder('Ingresa la razón del cierre')
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(true)
              .setMinLength(10)
              .setMaxLength(500)
          )
      );

    await interaction.showModal(Modal);
  },
};
