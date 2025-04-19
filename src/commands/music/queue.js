const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

let index;
module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("See the queue list")
    .addIntegerOption(opt => opt
      .setName("page")
      .setDescription("Number of pages")
      .setRequired(false)
    ),

  async execute(client, interaction) {
    const player = client.kazagumo.players.get(interaction.guild.id);
    const queue = player.queue;
    const page = interaction.options.getInteger("page");

    if (client.config.debug === "player" || client.config.debug === "all")
      console.log(queue);

    if (!player)
      return interaction.reply("📭 No music are playing!");

    index = page ? Number(page) - 1 : 0;

    let firstNumIndex = index * 10;
    let endNumIndex = firstNumIndex + 10;

    let songSize = queue.length;
    let totalPage = Math.ceil(songSize / 10);

    const queueStr = queue.slice(firstNumIndex, endNumIndex).map((song, i) => {
      return `${(i+1) + (index * 10)}) \`[${this.formatDuration(song.length)}]\` ${song.title} - <@${song.requester.id}>`
    }).join('\n');

    const currentSong = queue.current;

    let embed = new EmbedBuilder()
      .setTitle("Query Results")
      .setDescription(`**Currently Playing**\n` + 
      (currentSong ? `\`[${this.formatDuration(currentSong.length)}]\` ${currentSong.title} - <@${currentSong.requester.id}>` : "None") + `\n\n**Queue**\n${!player.queue.length ? "There's no song in queue" : queueStr} `)
      .setThumbnail(currentSong.thumbnail)
      .setColor("Blue")
      .setFooter({ text : `Page ${index+1} of ${totalPage === 0 ? "1" : totalPage}` })
      .setTimestamp(Date.now());

    await interaction.reply({
      embeds : [embed]
    });
  },
  formatDuration: (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
};