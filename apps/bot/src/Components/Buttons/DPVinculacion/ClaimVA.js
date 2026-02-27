import { ButtonInteraction, ButtonBuilder, ButtonStyle, MediaGalleryItemBuilder } from 'discord.js';
import TicketUserVA from '#database/models/DPVinculacion/TicketUserVA.js';
import { buildTicketContainer } from '#utils/buildTicketContainer.js';
import { CacheManager } from '#utils/CacheManager.js';

export default {
  customId: 'ClaimVA',
  /**
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply({ flags: 'Ephemeral' });

    const { guild, member, user, channel, message } = interaction;

    const setup = await CacheManager.getTicketSetupVA(guild.id);
    if (!setup) {
      return interaction.editReply({ content: 'Configuración no encontrada.' });
    }

    const hasClaimRole =
      member.roles.cache.has(setup.ClaimRole1) ||
      member.roles.cache.has(setup.ClaimRole2) ||
      member.roles.cache.has(setup.ClaimRole3) ||
      member.roles.cache.has(setup.ClaimRole4);

    if (!hasClaimRole) {
      return interaction.editReply({ content: 'No tienes permisos para reclamar tickets.' });
    }

    const ticket = await TicketUserVA.findOne({ TicketId: channel.id });
    if (!ticket || ticket.Estado !== 'abierto' || ticket.StaffAsignado) {
      return interaction.editReply({
        content: 'Este ticket ya fue reclamado o cerrado.',
      });
    }

    ticket.StaffAsignado = user.id;
    await ticket.save();

    const originalContainer = message.components[0];

    const sectionComponent = originalContainer.components.find((c) => c.type === 9);
    const textContent = sectionComponent?.components[0]?.content || '';

    const galleryComponent = originalContainer.components.find((c) => c.type === 12);
    const galleryItemBuilders = [];
    if (galleryComponent?.items?.length) {
      galleryComponent.items.forEach((item) => {
        galleryItemBuilders.push(
          new MediaGalleryItemBuilder()
            .setDescription(item.description || '')
            .setURL(item.media.url)
            .setSpoiler(item.spoiler || false)
        );
      });
    }

    const buttons = [
      new ButtonBuilder()
        .setCustomId('CloseVA')
        .setLabel('Cerrar')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('🔐')
        .setDisabled(false),

      new ButtonBuilder()
        .setCustomId('ClaimVA')
        .setLabel('Reclamar')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('✍🏻')
        .setDisabled(true),
    ];

    const container = buildTicketContainer({
      textContent,
      galleryItems: galleryItemBuilders,
      accentColor: 0x00ff00,
      buttons,
      client,
    });

    await message.edit({ components: [container] });

    await interaction.editReply({
      content: 'Has reclamado este ticket.',
    });
  },
};
