const { SlashCommandBuilder, EmbedBuilder, MessageFlags, Message } = require("discord.js");
const gen_lyrics = require("genius-lyrics");
const { trimLyrics } = require("../../func/utils/format");

module.exports = {
  data : new SlashCommandBuilder()
    .setName("lyrics")
    .setDescription("Showing lyrics of your song!")
    .addStringOption(opt => opt
      .setName("title")
      .setDescription("Title of the song")
      .setRequired(false)
    )
    .addBooleanOption(opt => opt
      .setName("private")
      .setDescription("Showing the lyrics privately")
      .setRequired(false)
    ),

  async execute(client, interaction) {
    if (client.config.commands.music.lyrics === 0) {
      return interaction.reply({ content: "❌  |  This command is disabled.", flags: MessageFlags.Ephemeral });
    }

    const player = client.kazagumo.players.get(interaction.guild.id);
    const title = interaction.options.getString("title");
    const private = interaction.options.getBoolean("private");

    if (!title && !player) {
      return interaction.reply({ content : "❌  |  No title are specified!", flags: MessageFlags.Ephemeral });
    }

    const lyricsFinder = new gen_lyrics.Client();
    const search = await lyricsFinder.songs.search((title ? title : player.queue.current.title)).catch(() => {});
    if (search.length === 0) {
      return interaction.reply({ content: "❌  |  Can't find lyrics! Try a more specific search term.", flags: MessageFlags.Ephemeral });
    }
    const song = search[0];

    try {
      let msgRaw = await song.lyrics();
      msg = trimLyrics(msgRaw);
      trimmedMsg = msg.substring(0, 2048);
    } catch {
      msg = "❌  |  Can't find lyrics! try a more specificly";
      return interaction.reply({ content : msg, ephemeral : true });
    }

    if (client.debug === "player" || client.debug === "all") {
        console.log(msg);
    }

    let embed = new EmbedBuilder()
      .setTitle(`Lyrics of ${song.title}`)
      .setDescription(trimmedMsg.length === 2048 ? `${trimmedMsg}...` : trimmedMsg)
      .setColor("Blue")
      .setTimestamp(Date.now())
      .setFooter({ text : `Artist by ${song.artist.name}` });

    await interaction.reply({ embeds : [embed], flags: private ? MessageFlags.Ephemeral : 0 });
  }
}