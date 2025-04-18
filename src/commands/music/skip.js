const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Go to the next song."),

  async execute(client, interaction) {
    const player = client.kazagumo.players.get(interaction.guild.id);
    if (!player || !player.playing) return interaction.reply("❌ No song are playing.");

    let queue = player.queue;
    let currentSong = queue.current.title;
    let nextSong = queue[0].title ?? null;

    if (!nextSong) {
      await player.destroy();
    } else {
      await player.skip();
    }

    let embed = new EmbedBuilder()
      .setTitle("Playback Information")
      .setColor("Blue")
      .setDescription(`⏭️ The song **${currentSong}** has been skipped!\n🎵 ${nextSong ? `Now Playing **${nextSong}**` : "The Player Has Stopped!"}`);

    await interaction.reply({ embeds : [embed] });
  },
};
