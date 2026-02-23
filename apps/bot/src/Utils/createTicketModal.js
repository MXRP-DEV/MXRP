import {
  ModalBuilder,
  LabelBuilder,
  TextInputBuilder,
  TextInputStyle,
  FileUploadBuilder,
} from 'discord.js';

export function createTicketModal({ id, title, includeFiles = false }) {
  const modal = new ModalBuilder().setCustomId(id).setTitle(title);

  modal.addLabelComponents(
    new LabelBuilder()
      .setLabel('Asunto')
      .setDescription('Escribe el asunto de tu solicitud')
      .setTextInputComponent(
        new TextInputBuilder()
          .setCustomId('Asunto')
          .setPlaceholder('Ejemplo: Problema con mis horas')
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
      )
  );

  modal.addLabelComponents(
    new LabelBuilder()
      .setLabel('Detalles')
      .setDescription('Describe los detalles de tu solicitud')
      .setTextInputComponent(
        new TextInputBuilder()
          .setCustomId('Detalles')
          .setPlaceholder('Explica tu situación con claridad')
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
      )
  );

  if (includeFiles) {
    modal.addLabelComponents(
      new LabelBuilder()
        .setLabel('Evidencias')
        .setDescription('Sube evidencias relevantes')
        .setFileUploadComponent(
          new FileUploadBuilder()
            .setCustomId('Evidencias')
            .setMinValues(1)
            .setMaxValues(3)
            .setRequired(true)
        )
    );
  }

  return modal;
}
