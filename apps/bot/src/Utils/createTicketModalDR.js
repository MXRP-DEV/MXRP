import {
  ModalBuilder,
  LabelBuilder,
  TextInputBuilder,
  TextInputStyle,
  FileUploadBuilder,
} from 'discord.js';

export function createTicketModalDR({ id, title, type }) {
  const modal = new ModalBuilder().setCustomId(id).setTitle(title);

  if (type === 'apelacion') {
    modal.addLabelComponents(
      new LabelBuilder()
        .setLabel('Solicitud DR')
        .setDescription('Explica tu solicitud relacionada con DR')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('pregunta_dr')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
        )
    );

    modal.addLabelComponents(
      new LabelBuilder()
        .setLabel('Fecha y hora del baneo')
        .setDescription('Formato: DD/MM AAAA HH:MM')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('fecha_hora_baneo')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        )
    );

    modal.addLabelComponents(
      new LabelBuilder()
        .setLabel('Servidor del baneo')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('servidor_baneo')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        )
    );

    modal.addLabelComponents(
      new LabelBuilder()
        .setLabel('Nombre e ID de Roblox')
        .setDescription('Ej: Nombre#1234')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('info_roblox')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        )
    );

    modal.addLabelComponents(
      new LabelBuilder()
        .setLabel('Razón del baneo (opcional)')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('razon_baneo')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false)
        )
    );
  }

  if (type === 'reporte') {
    modal.addLabelComponents(
      new LabelBuilder()
        .setLabel('Descripción del reporte')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('descripcion_reporte')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
        )
    );

    modal.addLabelComponents(
      new LabelBuilder()
        .setLabel('DR reportado')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('dr_reportado')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        )
    );

    modal.addLabelComponents(
      new LabelBuilder()
        .setLabel('Razón del reporte')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('razon_reporte')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
        )
    );

    modal.addLabelComponents(
      new LabelBuilder()
        .setLabel('Pruebas')
        .setDescription('Sube evidencias si las tienes')
        .setFileUploadComponent(
          new FileUploadBuilder()
            .setCustomId('pruebas_reporte')
            .setMinValues(1)
            .setMaxValues(3)
            .setRequired(false)
        )
    );
  }

  if (type === 'otros') {
    modal.addLabelComponents(
      new LabelBuilder()
        .setLabel('Consulta')
        .setDescription('Describe tu solicitud')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('pregunta_otros')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
        )
    );
  }

  return modal;
}
