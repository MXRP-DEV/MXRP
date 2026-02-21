import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder().setName('ping').setDescription('🛠️ Revisa el estado del bot'),

  async execute(interaction) {
    const client = interaction.client;
    const ping = client.ws.ping;
    const botPing = Math.abs(Date.now() - interaction.createdTimestamp);

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('📶 Estado del Bot')
      .addFields(
        { name: 'Latencia Websocket', value: `${ping}ms`, inline: true },
        { name: 'Latencia Bot', value: `${botPing}ms`, inline: true },
        { name: 'Usuarios', value: `${client.users.cache.size}`, inline: true }
      )
      .setFooter({ text: `Solicitado por ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
