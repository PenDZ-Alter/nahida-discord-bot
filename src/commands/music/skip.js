const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data : new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip to the next song"),

  async execute(client, interaction) {
    if (client.config.commands.music.skip === 0) {
      return interaction.reply({ content: "❌  |  This command is disabled.", ephemeral: true });
    }

    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply({ content : '❌  |  You are not connected to a voice channel!', ephemeral : true});
    const queue = client.player.nodes.get(interaction.guild);

    if (!interaction.member.voice.channel) return interaction.reply({ content: "❌  |  You must join vc first!", ephemeral: true });
    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
      return interaction.reply({ content: "❌  |  You must join in same vc to request song!", ephemeral: true })
    }

    if (!queue || !queue.node.isPlaying()) return interaction.reply({ content : "❌  |  You're not playing music rn!", ephemeral : true });
  
    const currentSong = queue.currentTrack;
    const nextSong = queue.tracks.data[0];

    await queue.node.skip();

    let embed = new EmbedBuilder()
      .setTitle("Playback Information")
      .setColor("Blue")
      .setDescription(`✅ The song **${currentSong}** has been skipped!\n🎵 ${nextSong ? `Now Playing **${nextSong}**` : "The Player Has Stopped!"}`);

    await interaction.reply({ embeds : [embed], ephemeral : false });
  }
}