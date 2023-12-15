const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const gen_lyrics = require("genius-lyrics");

module.exports = {
  data : new SlashCommandBuilder()
    .setName("lyrics")
    .setDescription("Showing lyrics of your song!")
    .addStringOption(opt => opt
      .setName("title")
      .setDescription("Title of the song")
      .setRequired(false)
    ),

  async execute(client, interaction) {
    const queue = client.player.nodes.get(interaction.guild);
    const title = interaction.options.getString("title");

    if (!title && !queue) {
      return interaction.reply({ content : "❌  |  No title specified!", ephemeral : true });
    }

    const lyricsFinder = new gen_lyrics.Client();
    const search = await lyricsFinder.songs.search((title ? title : queue.currentTrack.title)).catch(() => {});
    if (search.length === 0) {
      return interaction.reply({ content: "❌  |  Can't find lyrics! Try a more specific search term.", ephemeral: true });
    }
    console.log(search);
    const song = search[0];

    try {
      msg = await song.lyrics();
      trimmedMsg = msg.substring(0, 2048);
    } catch {
      msg = "❌  |  Can't find lyrics! try a more specificly";
      return interaction.reply({ content : msg, ephemeral : true });
    }

    let embed = new EmbedBuilder()
      .setTitle(`Lyrics of ${song.title}`)
      .setDescription(trimmedMsg.length === 2048 ? `${trimmedMsg}...` : trimmedMsg)
      .setColor("Blue")
      .setTimestamp(Date.now())
      .setFooter({ text : `Artist by ${song.artist.name}` });

    await interaction.reply({ embeds : [embed], ephemeral : true });
    // await interaction.reply({ content : "Sorry, but this command won't work! Please wait until it fixed :)", ephemeral : true });
  }
}