const { SlashCommandBuilder, EmbedBuilder, MessageFlags, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { formatDuration } = require("../../func/utils/format");

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
    if (client.config.commands.music.queue === 0) {
      return interaction.reply({ content: "❌  |  This command is disabled.", flags: MessageFlags.Ephemeral });
    }

    const player = client.kazagumo.players.get(interaction.guild.id);
    const queue = player.queue;
    const page = interaction.options.getInteger("page");

    if (client.debug === "player" || client.debug === "all")
      console.log(queue);

    if (!player)
      return interaction.reply("📭 No music are playing!");

    index = page ? Number(page) - 1 : 0;

    let firstNumIndex = index * 10;
    let endNumIndex = firstNumIndex + 10;

    let songSize = queue.length;
    let totalPage = Math.ceil(songSize / 10);

    const queueStr = queue.slice(firstNumIndex, endNumIndex).map((song, i) => {
      return `${(i+1) + (index * 10)}) \`[${formatDuration(song.length)}]\` ${song.title} - <@${song.requester.id}>`
    }).join('\n');

    const currentSong = queue.current;

    const prevButton = new ButtonBuilder()
      .setCustomId("prev-queue")
      .setLabel("⏮️")
      .setStyle(ButtonStyle.Secondary)

    const nextButton = new ButtonBuilder()
      .setCustomId("next-queue")
      .setLabel("⏭️")
      .setStyle(ButtonStyle.Primary)

    const actionRow = new ActionRowBuilder().addComponents(prevButton, nextButton);

    let embed = new EmbedBuilder()
      .setTitle("Query Results")
      .setDescription(`**Currently Playing**\n` + 
      (currentSong ? `\`[${formatDuration(currentSong.length)}]\` ${currentSong.title} - <@${currentSong.requester.id}>` : "None") + `\n\n**Queue**\n${!player.queue.length ? "There's no song in queue" : queueStr} `)
      .setThumbnail(currentSong.thumbnail)
      .setColor("Blue")
      .setFooter({ text : `Page ${index+1} of ${totalPage === 0 ? "1" : totalPage}` })
      .setTimestamp(Date.now());

    if (totalPage > 1) {
      await interaction.reply({
        embeds : [embed],
        components: [actionRow]
      });
    } else {
      await interaction.reply({ embeds : [embed] });
    }
  },

  getPage : () => {
    return index;
  },

  setPage : (updateIndex) => {
    return index = updateIndex;
  }
};