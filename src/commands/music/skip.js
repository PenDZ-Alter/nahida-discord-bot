const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Go to the next song."),

  async execute(client, interaction) {
    const player = client.kazagumo.players.get(interaction.guild.id);
    let queue = player.queue;

    if (client.config.debug === "player" || client.config.debug === "all") {
      console.log("INFO (Player) :: Queue Info");
      console.dir(queue, { depth : 1 });
    }

    if (!player || !player.playing) return interaction.reply("❌ No song are playing.");

    let currentSong = queue.current.title;
    let nextSong = queue[0]?.title;

    // Kalau gak ada lagu selanjutnya
    if (!nextSong) {
      player.skip();
      player.destroy(); // stop player
      const embed = new EmbedBuilder()
        .setTitle("Playback Information")
        .setColor("Red")
        .setDescription(`⏭️ The song **${currentSong}** has been skipped!\n📭 No more songs in queue. Player has stopped.`);

      return interaction.reply({ embeds: [embed] });
    }

    // Kalau ada lagu selanjutnya
    player.skip();
    const embed = new EmbedBuilder()
      .setTitle("Playback Information")
      .setColor("Blue")
      .setDescription(`⏭️ The song **${currentSong}** has been skipped!\n🎵 Now Playing **${nextSong}**`);

    await interaction.reply({ embeds: [embed] });
  },
};
