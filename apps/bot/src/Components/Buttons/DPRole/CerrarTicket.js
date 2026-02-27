import {
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  LabelBuilder,
} from 'discord.js';
import TicketUserDR from '#database/models/DPRole/TicketUserDR.js';

export default {
  customId: 'CloseDR',

  /**
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { channel } = interaction;
    const ticket = await TicketUserDR.findOne({ ChannelId: channel.id });

    if (!ticket || ticket.Estado !== 'abierto') {
      return interaction.reply({
        content: 'Este ticket no es valido o ya fue cerrado.',
        flags: 'Ephemeral',
      });
    }

    if (!ticket.StaffAsignado) {
      return interaction.reply({
        content: 'No se puede cerrar un ticket sin reclamar primero.',
        flags: 'Ephemeral',
      });
    }

    const Modal = new ModalBuilder()
      .setCustomId('CierreTicketDR')
      .setTitle('Cierre de Ticket')
      .addLabelComponents(
        new LabelBuilder()
          .setLabel('Razon del cierre')
          .setTextInputComponent(
            new TextInputBuilder()
              .setCustomId('Razon')
              .setPlaceholder('Ingresa la razon del cierre')
              .setStyle(TextInputStyle.Paragraph)
              .setRequired(true)
              .setMinLength(10)
              .setMaxLength(500)
          )
      );

    await interaction.showModal(Modal);
  },
};
