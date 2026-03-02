import {
  ModalBuilder,
  LabelBuilder,
  TextInputBuilder,
  TextInputStyle,
  FileUploadBuilder,
  StringSelectMenuBuilder,
  UserSelectMenuBuilder,
} from 'discord.js';

export function createTicketModalMXRP({ id, title, type }) {
  const modal = new ModalBuilder().setCustomId(id).setTitle(title);

  // ─── SOPORTE TECNICO ───
  if (type === 'Soporte') {
    modal.setLabelComponents(
      new LabelBuilder()
        .setLabel('Asunto')
        .setDescription('Breve descripción de tu problema')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('asunto_ticket')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Ej: No puedo iniciar sesión')
            .setRequired(true)
            .setMaxLength(100)
        ),
      new LabelBuilder()
        .setLabel('Descripción')
        .setDescription('Describe tu problema con el mayor detalle posible')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('descripcion_ticket')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('He intentado reiniciar la aplicación pero el error persiste...')
            .setRequired(true)
            .setMinLength(20)
            .setMaxLength(2000)
        ),
      new LabelBuilder()
        .setLabel('Sube una captura del Error (Opcional)')
        .setDescription('Sube hasta 3 archivos de menos de 500 MB')
        .setFileUploadComponent(
          new FileUploadBuilder()
            .setCustomId('error_adjunto')
            .setMinValues(1)
            .setMaxValues(3)
            .setRequired(false)
        )
    );
  }

  // ─── REPORTE DE USUARIO ───
  if (type === 'ReporteUsuario') {
    modal.setLabelComponents(
      new LabelBuilder()
        .setLabel('Usuario(s) Reportado(s)')
        .setDescription('Nombre de usuario en Roblox y Discord del reportado')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('Reportado')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Ejemplo: @usuario_discord | usuario_roblox')
            .setRequired(true)
            .setMaxLength(200)
        ),
      new LabelBuilder()
        .setLabel('Motivo del Reporte')
        .setDescription('Describe detalladamente qué regla se violó y cómo')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('Reason')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Explica qué regla se violó y proporciona detalles del incidente...')
            .setRequired(true)
            .setMinLength(30)
            .setMaxLength(1000)
        ),
      new LabelBuilder()
        .setLabel('Sube Pruebas del Reporte (Opcional)')
        .setDescription('Sube hasta 3 imágenes. Los videos pueden ser subidos después en el ticket')
        .setFileUploadComponent(
          new FileUploadBuilder()
            .setCustomId('user_pruebas')
            .setMinValues(0)
            .setMaxValues(3)
            .setRequired(false)
        )
    );
  }

  // ─── REPORTE DE STAFF ───
  if (type === 'ReporteStaff') {
    modal.setLabelComponents(
      new LabelBuilder()
        .setLabel('Staff Reportado(s)')
        .setDescription('Nombres de usuario (Roblox y Discord) del staff reportado')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('Reportados')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Ejemplo: @usuario_discord | usuario_roblox')
            .setRequired(true)
            .setMaxLength(500)
        ),
      new LabelBuilder()
        .setLabel('Víctimas del Incidente')
        .setDescription('Nombres de las personas afectadas por la conducta del staff')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('Denunciantes')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Nombres de los usuarios afectados')
            .setRequired(true)
            .setMaxLength(500)
        ),
      new LabelBuilder()
        .setLabel('Descripción Detallada del Incidente')
        .setDescription('Explica qué sucedió, cuándo, dónde y por qué es problemático')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('Reason')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Describe el incidente con el mayor detalle posible...')
            .setRequired(true)
            .setMinLength(30)
            .setMaxLength(1500)
        ),
      new LabelBuilder()
        .setLabel('Sube Pruebas del Incidente (Opcional)')
        .setDescription('Sube hasta 1 imagen. Los videos pueden ser subidos después en el ticket')
        .setFileUploadComponent(
          new FileUploadBuilder()
            .setCustomId('staff_pruebas')
            .setMinValues(0)
            .setMaxValues(3)
            .setRequired(false)
        )
    );
  }

  // ─── REPORTE ANONIMO ───
  if (type === 'ReporteAnonimo') {
    modal.setLabelComponents(
      new LabelBuilder()
        .setLabel('Motivo de la Solicitud')
        .setDescription('Explica por qué necesitas hacer esta solicitud de forma anónima')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('Reason')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('¿Por qué necesitas hacer esta solicitud de forma anónima?')
            .setMaxLength(800)
            .setRequired(true)
        ),
      new LabelBuilder()
        .setLabel('Método de Contacto Preferido')
        .setDescription('Indica cómo prefieres que te contactemos')
        .setStringSelectMenuComponent(
          new StringSelectMenuBuilder()
            .setCustomId('metodo')
            .setPlaceholder('Selecciona un método de contacto')
            .addOptions([
              { label: 'Via DM', value: 'DM' },
              { label: 'Via Ticket (MXRP)', value: 'Ticket' },
            ])
            .setMinValues(1)
            .setMaxValues(1)
            .setRequired(true)
        ),
      new LabelBuilder()
        .setLabel('Tipo de Reporte')
        .setDescription('Especifica si es un reporte de Staff o de Usuario')
        .setStringSelectMenuComponent(
          new StringSelectMenuBuilder()
            .setCustomId('tipo')
            .setPlaceholder('Selecciona el tipo de reporte')
            .addOptions([
              { label: 'Reporte de Usuario', value: 'ReporteUsuario' },
              { label: 'Reporte de Staff', value: 'ReporteStaff' },
            ])
            .setMinValues(1)
            .setMaxValues(1)
            .setRequired(true)
        ),
      new LabelBuilder()
        .setLabel('Usuario o Staff Reportado')
        .setDescription('Escoge al usuario al cual reportas (En caso de no estar omitirlo)')
        .setUserSelectMenuComponent(
          new UserSelectMenuBuilder()
            .setCustomId('reportado')
            .setPlaceholder('Selecciona al usuario')
            .setMinValues(1)
            .setMaxValues(5)
            .setRequired(false)
        )
    );
  }

  // ─── QUEJAS ───
  if (type === 'Quejas') {
    modal.setLabelComponents(
      new LabelBuilder()
        .setLabel('Asunto')
        .setDescription('Título breve de tu queja o consulta')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('Reason')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Título breve de tu queja o consulta')
            .setRequired(true)
        ),
      new LabelBuilder()
        .setLabel('Descripción Detallada')
        .setDescription('Explica tu situación de manera clara y detallada')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('Details')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Explica tu situación de manera clara y detallada')
            .setMaxLength(1500)
            .setRequired(true)
        )
    );
  }

  // ─── CK (CHARACTER KILL) ───
  if (type === 'CK') {
    modal.setLabelComponents(
      new LabelBuilder()
        .setLabel('Tu Nombre de Usuario')
        .setDescription('Tu nombre de usuario en Roblox')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('CK')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Tu nombre de usuario en Roblox')
            .setRequired(true)
        ),
      new LabelBuilder()
        .setLabel('Información de Rol Avanzado')
        .setDescription('Especifica si tienes algún rol avanzado y proporciona detalles')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('Avanzado')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('¿Tienes algún rol avanzado? Especifica cuál y detalles')
            .setMaxLength(500)
            .setRequired(true)
        ),
      new LabelBuilder()
        .setLabel('Plan para Ejecutar el CK')
        .setDescription('Explica detalladamente cómo planeas realizar el CK')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('Logracion')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Explica detalladamente cómo planeas realizar el CK')
            .setMaxLength(1000)
            .setRequired(true)
        ),
      new LabelBuilder()
        .setLabel('Usuario Objetivo')
        .setDescription('Nombre del usuario al que se le aplicará el CK')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('UserCK')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Nombre del usuario al que se le aplicará el CK')
            .setRequired(true)
        )
    );
  }

  // ─── FACCIONES ───
  if (type === 'Facciones') {
    modal.setLabelComponents(
      new LabelBuilder()
        .setLabel('Nombre de la Facción/Empresa')
        .setDescription('Especifica el nombre que tendrá tu facción o empresa')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('Faccion')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('¿Cómo se llamará tu facción o empresa?')
            .setMaxLength(100)
            .setRequired(true)
        ),
      new LabelBuilder()
        .setLabel('Descripción y Propósito')
        .setDescription('Describe qué hará tu facción/empresa y por qué debería ser aprobada')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('Reason')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Describe qué hará tu facción/empresa y por qué debería ser aprobada')
            .setMaxLength(1500)
            .setRequired(true)
        )
    );
  }

  // ─── EMPRESAS ───
  if (type === 'Empresas') {
    modal.setLabelComponents(
      new LabelBuilder()
        .setLabel('Nombre de la Empresa')
        .setDescription('Especifica el nombre que tendrá tu empresa')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('Nombre')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('¿Cómo se llamará tu empresa?')
            .setRequired(true)
        ),
      new LabelBuilder()
        .setLabel('Dueño de la Empresa')
        .setDescription('Indica quién es el dueño de la empresa')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('Dueño')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('¿Quién es el dueño de la empresa?')
            .setRequired(true)
        )
    );
  }

  // ─── LIVERYS ───
  if (type === 'Liverys') {
    modal.setLabelComponents(
      new LabelBuilder()
        .setLabel('Modelo del Vehículo')
        .setDescription('Especifica el modelo del vehículo para el cual solicitas el livery')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('Vehicle_model')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Ejemplo: Police Crown Victoria, Ambulance, etc.')
            .setRequired(true)
        ),
      new LabelBuilder()
        .setLabel('Facción o Empresa Solicitante')
        .setDescription('Indica la facción o empresa que solicita el livery')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('Faction')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Ejemplo: Policía Nacional, Hospital Central, etc.')
            .setRequired(true)
        )
    );
  }

  // ─── REMOVER ROL ───
  if (type === 'RemoverRol') {
    modal.setLabelComponents(
      new LabelBuilder()
        .setLabel('Rol a Remover')
        .setDescription('Especifica el nombre del rol que deseas remover')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('Rol')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Ejemplo: Guardia Nacional, Médico, etc.')
            .setRequired(true)
        ),
      new LabelBuilder()
        .setLabel('Motivo de la Remoción')
        .setDescription('Explica por qué quieres que se remueva este rol')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('Reason')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Explica por qué quieres que se remueva este rol')
            .setMaxLength(800)
            .setRequired(true)
        )
    );
  }

  // ─── PETICION DE ROL ───
  if (type === 'Peticion') {
    modal.setLabelComponents(
      new LabelBuilder()
        .setLabel('Rol Solicitado')
        .setDescription('Especifica el rol que deseas solicitar')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('Rol')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('¿Qué rol necesitas? (Ejemplo: Médico, Policía, etc.)')
            .setMaxLength(200)
            .setRequired(true)
        ),
      new LabelBuilder()
        .setLabel('Justificación')
        .setDescription('Explica por qué deberías recibir este rol e incluye experiencia relevante')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('Reason')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('¿Por qué deberías recibir este rol? Incluye experiencia relevante')
            .setMaxLength(1000)
            .setRequired(true)
        )
    );
  }

  // ─── WARN ───
  if (type === 'Warn') {
    modal.setLabelComponents(
      new LabelBuilder()
        .setLabel('Descripción del Warn')
        .setDescription('Describe el warn que quieres que sea removido')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('Warn')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Describe el warn que quieres que sea removido')
            .setMaxLength(300)
            .setRequired(true)
        ),
      new LabelBuilder()
        .setLabel('Justificación para la Remoción')
        .setDescription('Explica por qué consideras que el warn debería ser removido')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('Details')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Explica por qué consideras que el warn debería ser removido')
            .setMaxLength(1000)
            .setRequired(true)
        ),
      new LabelBuilder()
        .setLabel('Staff que Aplicó el Warn')
        .setDescription('Nombre del staff que aplicó la sanción')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('Staff')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Nombre del staff que aplicó la sanción')
            .setRequired(true)
        )
    );
  }

  // ─── ROBOS ───
  if (type === 'Robos') {
    modal.setLabelComponents(
      new LabelBuilder()
        .setLabel('Usuario Afectado')
        .setDescription('Nombre del usuario que fue robado')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('Robado')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Nombre del usuario que fue robado')
            .setRequired(true)
        ),
      new LabelBuilder()
        .setLabel('Descripción del Robo')
        .setDescription('Describe qué fue robado y las circunstancias del incidente')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('Extra')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Describe qué fue robado y las circunstancias')
            .setMaxLength(1000)
            .setRequired(true)
        )
    );
  }

  // ─── HOSTING ───
  if (type === 'Hosting') {
    modal.setLabelComponents(
      new LabelBuilder()
        .setLabel('Nombre del Servidor/Facción')
        .setDescription('Especifica el nombre de tu servidor o facción')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('ServerName')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Ejemplo: Facción Los Santos, Comunidad Gaming, etc.')
            .setRequired(true)
        ),
      new LabelBuilder()
        .setLabel('Plan Seleccionado')
        .setDescription('Selecciona el plan que deseas contratar')
        .setStringSelectMenuComponent(
          new StringSelectMenuBuilder()
            .setCustomId('PlanType')
            .setPlaceholder('Selecciona un plan')
            .addOptions([
              {
                label: '🟡 PLAN BASE',
                description: 'Plan base con características esenciales - $350 MXN',
                value: 'plan_base',
              },
              {
                label: '🟣 PLAN PREMIUM',
                description: 'Plan premium con todas las características - $600 MXN',
                value: 'plan_premium',
              },
            ])
            .setRequired(true)
        ),
      new LabelBuilder()
        .setLabel('Tipo de Mantenimiento')
        .setDescription('Selecciona el tipo de mantenimiento que prefieres')
        .setStringSelectMenuComponent(
          new StringSelectMenuBuilder()
            .setCustomId('MaintenanceType')
            .setPlaceholder('Selecciona un tipo de mantenimiento')
            .addOptions([
              {
                label: '🗓️ Mensual',
                description: 'Mantenimiento mensual - $100 MXN',
                value: 'mensual',
              },
              {
                label: '📆 Semestral',
                description: 'Mantenimiento semestral - $550 MXN',
                value: 'semestral',
              },
              {
                label: '📦 Anual',
                description: 'Mantenimiento anual - $950 MXN',
                value: 'anual',
              },
            ])
            .setRequired(true)
        ),
      new LabelBuilder()
        .setLabel('Requerimientos Específicos')
        .setDescription('Describe qué comandos/sistemas específicos necesitas para tu servidor')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('Requirements')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Describe qué comandos/sistemas específicos necesitas para tu servidor')
            .setMaxLength(1000)
            .setRequired(true)
        ),
      new LabelBuilder()
        .setLabel('Información Adicional (Opcional)')
        .setDescription('Cualquier detalle extra que consideres importante mencionar')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('AdditionalInfo')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Cualquier detalle extra que consideres importante mencionar')
            .setMaxLength(500)
            .setRequired(false)
        )
    );
  }

  // ─── SOPORTE VIP ───
  if (type === 'SoporteVip' || type === 'SoportePrioritario') {
    modal.setLabelComponents(
      new LabelBuilder()
        .setLabel('Asunto')
        .setDescription('Breve descripción de tu solicitud de soporte')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('asunto_ticket')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Ej: Problema con beneficios VIP')
            .setRequired(true)
            .setMaxLength(100)
        ),
      new LabelBuilder()
        .setLabel('Descripción')
        .setDescription('Describe tu problema con el mayor detalle posible')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('descripcion_ticket')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Incluye detalles relevantes para resolver tu solicitud')
            .setRequired(true)
            .setMinLength(20)
            .setMaxLength(2000)
        )
    );
  }

  // ─── GENERICOS (Otros, Servicios, Compras, Compras IRL, Ine/Pasaporte, Diseñadores, Reclamar) ───
  if (
    [
      'Otros',
      'Servicios',
      'Compras',
      'ComprasIRL',
      'InePasaporte',
      'Disenadores',
      'Reclamar',
    ].includes(type)
  ) {
    modal.setLabelComponents(
      new LabelBuilder()
        .setLabel('Asunto')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('Reason')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Título breve de tu solicitud')
            .setRequired(true)
        ),
      new LabelBuilder()
        .setLabel('Descripción')
        .setTextInputComponent(
          new TextInputBuilder()
            .setCustomId('Details')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Describe tu solicitud con claridad')
            .setRequired(true)
            .setMaxLength(1500)
        )
    );
  }

  if (!['Soporte', 'ReporteStaff', 'Hosting'].includes(type)) {
    modal.addLabelComponents(
      new LabelBuilder()
        .setLabel('Evidencias (Opcional)')
        .setDescription('Sube hasta 3 archivos de menos de 500 MB')
        .setFileUploadComponent(
          new FileUploadBuilder()
            .setCustomId('Evidencias')
            .setMinValues(0)
            .setMaxValues(3)
            .setRequired(false)
        )
    );
  }

  return modal;
}
