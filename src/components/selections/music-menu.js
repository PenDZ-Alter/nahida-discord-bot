const { EmbedBuilder } = require("discord.js");
const { getResultData } = require("../../commands/music/search");

module.exports = {
  data: { name: "music-menu" },

  async execute(client, interaction) {
    const queue = client.player.nodes.get(interaction.guild);
    const result = getResultData();

    let value = Number(interaction.values[0]);

    let track = result.tracks[value];

    queue.addTrack(track);
    let title = track.title;

    try {
      if (!queue.node.isPlaying()) {
        await queue.node.play();
      }
    } catch (err) {
      console.error('Failed to start playback:', err);
    }

    let songIndex = queue.getSize();

    let embed = new EmbedBuilder()
      .setTitle("Playback Information")
      .setColor("Blue")
      .setDescription(
        `📝  |  **${title}** has been enqueued!
        ℹ️  |  Source : ${track.source}
        ℹ️  |  ${`Track Status : ${songIndex === 0 ? "Playing right now!" : `Added in position ${songIndex}`}`}`);

    await interaction.update({ content: "", embeds: [embed], components: [] });
  }
}