const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data : new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with pong'),

  async execute(client, interaction) {
    if (client.config.commands.etc.ping === 0) {
      return interaction.reply({ content: "❌  |  This command is disabled.", ephemeral: true });
    }

    const message_init = await interaction.deferReply({ fetchReply : true, ephemeral : true });

    const message = `API Latency : ${client.ws.ping}ms\nClient Ping : ${message_init.createdTimestamp - interaction.createdTimestamp}ms`;
    await interaction.editReply({ content : message });
  }
}