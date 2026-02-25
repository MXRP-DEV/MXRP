import {
  ModalBuilder,
  LabelBuilder,
  TextInputBuilder,
  TextInputStyle,
  FileUploadBuilder,
} from 'discord.js';

export function createInformeModal({ id, title, tipo }) {
  const modal = new ModalBuilder().setCustomId(id).setTitle(title);

  modal.addLabelComponents(
    new LabelBuilder()
      .setLabel('Observación')
      .setDescription('Escribe tu observación de tu jornada semanal')
      .setTextInputComponent(
        new TextInputBuilder()
          .setCustomId('Observacion')
          .setPlaceholder('Describe tu jornada semanal...')
          .setStyle(TextInputStyle.Paragraph)
          .setMaxLength(1000)
          .setRequired(true)
      )
  );

  modal.addLabelComponents(
    new LabelBuilder()
      .setLabel('Pruebas')
      .setDescription('Sube tus evidencias (mínimo 2, máximo 10)')
      .setFileUploadComponent(
        new FileUploadBuilder()
          .setCustomId('Pruebas')
          .setMinValues(2)
          .setMaxValues(10)
          .setRequired(true)
      )
  );

  modal.addLabelComponents(
    new LabelBuilder()
      .setLabel('Notas')
      .setDescription('Ingresa tu nota semanal')
      .setTextInputComponent(
        new TextInputBuilder()
          .setCustomId('Notas')
          .setPlaceholder('Tus notas extras...')
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
      )
  );

  modal.addLabelComponents(
    new LabelBuilder()
      .setLabel('Sugerencias')
      .setDescription('¿Tienes alguna sugerencia? (Opcional)')
      .setTextInputComponent(
        new TextInputBuilder()
          .setCustomId('Sugerencias')
          .setPlaceholder('Tus sugerencias...')
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(false)
      )
  );

  return modal;
}
