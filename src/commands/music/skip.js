const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data : new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip to the next song"),

  async execute(client, interaction) {
    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply('❌  |  You are not connected to a voice channel!');
    const queue = client.player.nodes.get(interaction.guild);

    if (!interaction.member.voice.channel) return interaction.reply({ content: "❌  |  You must join vc first!", ephemeral: true });
    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
      return interaction.reply({ content: "❌  |  You must join in same vc to request song!", ephemeral: true })
    }

    if (!queue) return interaction.reply({ content : "❌  |  Can't get player from your guild!", ephemeral : true });
    if (!queue.node.isPlaying()) return interaction.reply({ content : "❌  |  You're not playing the song", ephemeral : true });
  
    // const currentSong = queue.currentTrack;
    // const nextSong = queue.tracks[0];

    // if (!nextSong) {
    //   await queue.delete();
    // } else {
    //   await queue.node.skip();
    // }

    await queue.node.skip();

    await interaction.reply({ content : "✅  |  Skipped to next song!", ephemeral : true });
  }
}