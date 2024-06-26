const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data : new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Show the 10 song in queue")
    .addIntegerOption(opt =>
      opt.setName("pageindex")
        .setDescription("Number of pages")
        .setRequired(false)  
    ),

  async execute(client, interaction) {
    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply('❌  |  You are not connected to a voice channel!');
    const queue = client.player.nodes.get(interaction.guild);
    const page = interaction.options.getInteger("pageindex");

    let index = page ? Number(page) - 1 : 0;

    if (!interaction.member.voice.channel) return interaction.reply({ content: "❌  |  You must join vc first!", ephemeral: true });
    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
      return interaction.reply({ content: "❌  |  You must join in same vc to request song!", ephemeral: true })
    }

    if (!queue) return interaction.reply({ content : "❌  |  Can't get player from your guild!", ephemeral : true });
    if (!queue.node.isPlaying()) return interaction.reply({ content : "❌  |  You're not playing the song", ephemeral : true });
  
    let firstNumIndex = index-1 * 10;
    let endNumIndex = firstNumIndex + 10;

    let songSize = queue.getSize();
    let totalPage = Math.ceil(songSize / 10);

    const queueStr = queue.tracks.toArray().slice(firstNumIndex, endNumIndex).map((song, i) => {
      return `${i+1}) \`[${song.duration}]\` ${song.title} - <@${song.requestedBy.id}>`
    }).join('\n');

    const currentSong = queue.currentTrack;

    let embed = new EmbedBuilder()
      .setTitle("Query Results")
      .setDescription(`**Currently Playing**\n` + 
      (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} - <@${currentSong.requestedBy.id}>` : "None") +
      `\n\n**Queue**\n${queueStr} `)
      .setThumbnail(currentSong.thumbnail)
      .setColor("Blue")
      .setFooter({ text : `Page ${index+1} of ${totalPage}` })
      .setTimestamp(Date.now())

    await interaction.reply({
      embeds : [embed]
    })
  }
}
