const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data : new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong'),

  async execute(client, interaction) {
    const message_init = await interaction.deferReply({ fetchReply : true, ephemeral : true });

    const message = `API Latency : ${client.ws.ping}ms\nClient Ping : ${message_init.createdTimestamp - interaction.createdTimestamp}ms`;
    await interaction.editReply({ content : message });
  }
}