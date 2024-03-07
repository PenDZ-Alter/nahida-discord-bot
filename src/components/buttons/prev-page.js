const { EmbedBuilder } = require("discord.js");
const { getPage, setPage } = require("../../commands/music/queue.js");

module.exports = {
  data : { name : "prev-page" },

  async execute(client, interaction) {
    const queue = client.player.nodes.get(interaction.guild);
    let indexPage = getPage();

    if (!interaction.user.id) return interaction.reply({ content : "❌  |  You're not allowed to use this button!", ephemeral : true });
    let index = indexPage - 1;
    if (index < 0) index = 0;
    setPage(index);

    if (!interaction.member.voice.channel) return interaction.reply({ content: "❌  |  You must join vc first!", ephemeral: true });
    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
      return interaction.reply({ content: "❌  |  You must join in same vc to request song!", ephemeral: true })
    }

    if (!queue) return interaction.reply({ content : "❌  |  Can't get player from your guild!", ephemeral : true });
    if (!queue.node.isPlaying()) return interaction.reply({ content : "❌  |  You're not playing the song", ephemeral : true });
  
    let firstNumIndex = index * 10;
    let endNumIndex = firstNumIndex + 10;

    let songSize = queue.getSize();
    let totalPage = Math.ceil(songSize / 10);

    const queueStr = queue.tracks.toArray().slice(firstNumIndex, endNumIndex).map((song, i) => {
      return `${(i+1) + (index * 10)}) \`[${song.duration}]\` ${song.title} - <@${song.requestedBy.id}>`
    }).join('\n');

    const currentSong = queue.currentTrack;

    let updatedEmbed = new EmbedBuilder()
      .setTitle("Query Results")
      .setDescription(`**Currently Playing**\n` + 
      (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} - <@${currentSong.requestedBy.id}>` : "None") +
      `\n\n**Queue**\n${queueStr} `)
      .setThumbnail(currentSong.thumbnail)
      .setColor("Blue")
      .setFooter({ text : `Page ${index+1} of ${totalPage === 0 ? "1" : totalPage}` })
      .setTimestamp(Date.now());

    await interaction.update({
      embeds : [updatedEmbed]
    });
  }
}