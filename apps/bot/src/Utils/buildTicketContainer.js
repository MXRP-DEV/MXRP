import { ContainerBuilder, UserSelectMenuBuilder, SeparatorSpacingSize } from 'discord.js';

export function buildTicketContainer({ textContent, galleryItems, accentColor, buttons, client }) {
  const container = new ContainerBuilder()
    .setAccentColor(accentColor)
    .addSectionComponents((section) =>
      section
        .addTextDisplayComponents((text) => text.setContent(textContent))
        .setThumbnailAccessory((thumb) =>
          thumb.setURL(client.user.displayAvatarURL({ size: 1024, extension: 'png' }))
        )
    )
    .addSeparatorComponents((sep) => sep.setSpacing(SeparatorSpacingSize.Small).setDivider(true));

  if (galleryItems?.length) {
    container.addMediaGalleryComponents((gallery) => gallery.addItems(...galleryItems));
  }

  container
    .addSeparatorComponents((sep) => sep.setSpacing(SeparatorSpacingSize.Large).setDivider(true))
    .addActionRowComponents((row) => row.addComponents(...buttons))
    .addActionRowComponents((row) =>
      row.addComponents(
        new UserSelectMenuBuilder()
          .setCustomId('DITicketAddUser')
          .setPlaceholder('👥 Agregar usuario al ticket')
          .setMinValues(1)
          .setMaxValues(10)
      )
    );

  return container;
}
