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
    const channel = interaction.member.voice.channel;
    // if (!channel) return interaction.reply({ content : '❌  |  You are not connected to a voice channel!', ephemeral : true});
    const queue = client.player.nodes.get(interaction.guild);
    const title = interaction.options.getString("title");

    // if (!interaction.member.voice.channel) return interaction.reply({ content: "❌  |  You must join vc first!", ephemeral: true });
    // if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
    //   return interaction.reply({ content: "❌  |  You must join in same vc to request song!", ephemeral: true })
    // }

    const lyricsFinder = new gen_lyrics.Client();
    const search = await lyricsFinder.songs.search((title ? title : queue.currentTrack.title)); // title ? title : queue.currentTrack.title
    if (search.length === 0) {
      return interaction.reply({ content: "❌  |  Can't find lyrics! Try a more specific search term.", ephemeral: true });
    }
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