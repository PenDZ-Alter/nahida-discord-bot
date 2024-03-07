const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { repeatStatus } = require("./repeat");

let index;

module.exports = {
  data : new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Show the 10 song in queue")
    .addIntegerOption(opt =>
      opt.setName("page")
        .setDescription("Number of pages")
        .setRequired(false)  
    ),

  async execute(client, interaction) {
    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply({ content : '❌  |  You are not connected to a voice channel!', ephemeral : true});
    const queue = client.player.nodes.get(interaction.guild);
    const page = interaction.options.getInteger("page");

    index = page ? Number(page) - 1 : 0;

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

    const prevButton = new ButtonBuilder()
      .setCustomId("prev-page")
      .setLabel("Prev")
      .setStyle(ButtonStyle.Secondary)

    const nextButton = new ButtonBuilder()
      .setCustomId("next-page")
      .setLabel("Next")
      .setStyle(ButtonStyle.Primary)

    const actionRow = new ActionRowBuilder().addComponents(prevButton, nextButton);

    let embed = new EmbedBuilder()
      .setTitle("Query Results")
      .setDescription(`**Currently Playing**\n` + 
      (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} - <@${currentSong.requestedBy.id}>` : "None") +
      `${repeatStatus() === "Track" ? "\n\n**⚠️  |  Loop Track Detected!**\nThe queue may be not used, unless you turning off the track loop!" : ""}\n\n**Queue**\n${queueStr} `)
      .setThumbnail(currentSong.thumbnail)
      .setColor("Blue")
      .setFooter({ text : `Page ${index+1} of ${totalPage === 0 ? "1" : totalPage}` })
      .setTimestamp(Date.now());

    await interaction.reply({
      embeds : [embed],
      components : [actionRow]
    });
  },

  getPage : () => {
    return index;
  }, 
  
  setPage : (a) => {
    return index = a;
  }
}