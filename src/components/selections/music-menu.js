const { EmbedBuilder } = require("discord.js");
const { getResultData } = require("../../commands/music/search");

module.exports = {
  data: { name: "music-menu" },

  async execute(client, interaction) {
    const player = client.kazagumo.players.get(interaction.guild.id);
    const queue = player.queue;
    const result = getResultData();

    let value = Number(interaction.values[0]);

    let track = result.tracks[value];
    if (client.debug == 'player' || client.debug == 'all') {
      console.log(`Selected track: ${track.title} (Source: ${track.sourceName})`);
      console.log(track);
    }

    await queue.add(track);
    let title = track.title;

    try {
      if (!player.playing) {
        await player.play();
      }
    } catch (err) {
      console.error('Failed to start playback:', err);
    }

    let songIndex = queue.length;

    let embed = new EmbedBuilder()
      .setTitle("Playback Information")
      .setColor("Blue")
      .setDescription(
        `📝  |  **${title}** has been enqueued!
        ℹ️  |  Source : ${track.sourceName}
        ℹ️  |  ${`Track Status : ${songIndex === 0 ? "Playing right now!" : `Added in position ${songIndex}`}`}`);

    await interaction.update({ content: "", embeds: [embed], components: [] });
  }
}