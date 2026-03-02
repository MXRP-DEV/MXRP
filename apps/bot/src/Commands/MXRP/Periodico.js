import {
  SlashCommandBuilder,
  ApplicationIntegrationType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  FileUploadBuilder,
  LabelBuilder,
  StringSelectMenuBuilder,
  ChatInputCommandInteraction,
  Colors,
  StringSelectMenuOptionBuilder,
} from 'discord.js';
import { COMMAND_SCOPES } from '#config/guilds.js';
import { CacheManager } from '#utils/CacheManager.js';

export default {
  scope: COMMAND_SCOPES.MXRP,
  data: new SlashCommandBuilder()
    .setName('periodico')
    .setDescription('Redactar una nueva noticia para el periódico')
    .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { guild, member } = interaction;

    const setup = await CacheManager.getPeriodicoSetup(guild.id);
    if (!setup || !setup.CanalNoticias) {
      return interaction.reply({
        content: '❌ El sistema de periódico no está configurado.',
        flags: 'Ephemeral',
      });
    }

    if (setup.RolPeriodista && !member.roles.cache.has(setup.RolPeriodista)) {
      return interaction.reply({
        content: '❌ No tienes el rol de periodista para publicar noticias.',
        flags: 'Ephemeral',
      });
    }

    const modal = new ModalBuilder()
      .setCustomId('PeriodicoModalMXRP')
      .setTitle('Crea tu Noticia')
      .setLabelComponents(
        new LabelBuilder()
          .setLabel('Título de la Noticia')
          .setDescription('Especifica el título de la noticia')
          .setTextInputComponent(
            new TextInputBuilder()
              .setCustomId('titulo')
              .setStyle(TextInputStyle.Short)
              .setPlaceholder('Ej: ¡Nuevo evento en la ciudad!')
              .setRequired(true)
              .setMaxLength(100)
          ),
        new LabelBuilder()
          .setLabel('Contenido de la Noticia')
          .setDescription('Escribe el contenido detallado de la noticia')
          .setTextInputComponent(
            new TextInputBuilder()
              .setCustomId('contenido')
              .setStyle(TextInputStyle.Paragraph)
              .setPlaceholder('Escribe aquí el contenido de la noticia...')
              .setRequired(true)
              .setMinLength(200)
              .setMaxLength(2000)
          ),
        new LabelBuilder()
          .setLabel('Color')
          .setDescription('Elige un color que se usará para la noticia.')
          .setStringSelectMenuComponent(
            new StringSelectMenuBuilder()
              .setCustomId('color')
              .setPlaceholder('Elige un color')
              .addOptions(
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
                  label: 'Red',
                  value: Colors.Red.toString(),
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
          ),
        new LabelBuilder()
          .setLabel('Imagen de la Noticia')
          .setDescription('Sube una imagen relacionada con la noticia (Opcional)')
          .setFileUploadComponent(
            new FileUploadBuilder()
              .setCustomId('imagen')
              .setMinValues(1)
              .setMaxValues(6)
              .setRequired(false)
          )
      );

    await interaction.showModal(modal);
  },
};
