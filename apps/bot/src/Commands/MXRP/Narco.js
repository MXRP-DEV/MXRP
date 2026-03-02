import {
  SlashCommandBuilder,
  ApplicationIntegrationType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  FileUploadBuilder,
  LabelBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  Colors,
  UserSelectMenuBuilder,
} from 'discord.js';
import { COMMAND_SCOPES } from '#config/guilds.js';
import { CacheManager } from '#utils/CacheManager.js';

export default {
  scope: COMMAND_SCOPES.MXRP,
  data: new SlashCommandBuilder()
    .setName('narco')
    .setDescription('🚬 Envia un mensaje anónimo al NarcoBlog')
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),

  async execute(interaction, client) {
    const { guild } = interaction;

    const setup = await CacheManager.getNarcoBlogSetup(guild.id);
    if (!setup || !setup.RegistroId || !setup.NotifyId) {
      return interaction.reply({
        content: '❌ El sistema de NarcoBlog no está configurado.',
        flags: 'Ephemeral',
      });
    }

    const modal = new ModalBuilder()
      .setCustomId('NarcoModalMXRP')
      .setTitle('💀 NarcoBlog')
      .setLabelComponents(
        new LabelBuilder()
          .setLabel('Mensaje')
          .setDescription('Escribe tu mensaje para el NarcoBlog')
          .setTextInputComponent(
            new TextInputBuilder()
              .setCustomId('mensaje')
              .setStyle(TextInputStyle.Paragraph)
              .setPlaceholder('Escribe aquí tu mensaje...')
              .setRequired(true)
              .setMinLength(10)
              .setMaxLength(2000)
          ),
        new LabelBuilder()
          .setLabel('VPN')
          .setDescription('¿Deseas usar un VPN? (Anónimo total)')
          .setStringSelectMenuComponent(
            new StringSelectMenuBuilder()
              .setCustomId('vpn')
              .setPlaceholder('Selecciona una opción')
              .addOptions(
                new StringSelectMenuOptionBuilder()
                  .setLabel('Si (Anónimo + IP Ficticia)')
                  .setValue('si')
                  .setEmoji('🔒')
                  .setDescription('Oculta tu identidad completamente'),
                new StringSelectMenuOptionBuilder()
                  .setLabel('No (Mostrar Identidad)')
                  .setValue('no')
                  .setEmoji('🔓')
                  .setDescription('Tu nombre será visible')
              )
              .setRequired(true)
          ),
        new LabelBuilder()
          .setLabel('Color')
          .setDescription(
            'Elige un color para el mensaje (Si usa VPN, será ignorado y usará gris oscuro).'
          )
          .setStringSelectMenuComponent(
            new StringSelectMenuBuilder()
              .setCustomId('color')
              .setPlaceholder('Elige un color')
              .addOptions(
                {
                  label: 'Red (Default)',
                  value: Colors.Red.toString(),
                },
                {
                  label: 'NotQuiteBlack',
                  value: Colors.NotQuiteBlack.toString(),
                },
                {
                  label: 'Blurple',
                  value: Colors.Blurple.toString(),
                },
                {
                  label: 'Green',
                  value: Colors.Green.toString(),
                },
                {
                  label: 'Yellow',
                  value: Colors.Yellow.toString(),
                },
                {
                  label: 'White',
                  value: Colors.White.toString(),
                }
              )
              .setRequired(false)
          ),
        new LabelBuilder()
          .setLabel('Usuarios')
          .setDescription('Necesitas hacerle ping a usuarios?')
          .setUserSelectMenuComponent(
            new UserSelectMenuBuilder()
              .setCustomId('usuarios')
              .setPlaceholder('Selecciona usuarios')
              .setMinValues(0)
              .setMaxValues(5)
              .setRequired(false)
          ),
        new LabelBuilder()
          .setLabel('Multimedia')
          .setDescription('Adjuntar Imagen o Video (Opcional)')
          .setFileUploadComponent(
            new FileUploadBuilder()
              .setCustomId('media')
              .setMinValues(1)
              .setMaxValues(5)
              .setRequired(false)
          )
      );

    await interaction.showModal(modal);
  },
};
