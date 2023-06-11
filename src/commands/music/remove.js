const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data : new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove song from index")
    .addIntegerOption(opt => opt
      .setName("index")
      .setDescription("Number of index")
      .setRequired(true)  
    ),

  async execute(client, interaction) {
    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply('❌  |  You are not connected to a voice channel!');
    const queue = client.player.nodes.get(interaction.guild);
    const index = Number(interaction.options.getInteger("index"));

    if (!interaction.member.voice.channel) return interaction.reply({ content: "❌  |  You must join vc first!", ephemeral: true });
    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
      return interaction.reply({ content: "❌  |  You must join in same vc to request song!", ephemeral: true })
    }

    if (!queue) return interaction.reply({ content : "❌  |  Can't get player from your guild!", ephemeral : true });
    if (!queue.node.isPlaying()) return interaction.reply({ content : "❌  |  You're not playing the song", ephemeral : true });
  
    if (index > queue.tracks.length)
      return interaction.reply({ content : "❌  |  Invalid Index", ephemeral : true });

    await queue.node.remove(index-1);

    await interaction.reply({ content : `✅  |  Removed song from index ${index}!`, ephemeral : true });
  }
}