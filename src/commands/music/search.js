const { SlashCommandBuilder, EmbedBuilder, MessageFlags, StringSelectMenuBuilder, ActionRowBuilder } = require("discord.js");

let result;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Search and select the song")
    .addStringOption(option =>
      option.setName("query")
        .setDescription("Title or url of song")
        .setRequired(true)
    )
    .addStringOption(opt => 
      opt.setName("platform")
        .setDescription("Select Search Engine to search any music based on these platform")
        .setRequired(false)
        .addChoices(
          { name: "Youtube", value: "youtube" },
          { name: "Spotify", value: "spotify" },
          { name: "Soundcloud", value: "soundcloud" }
        )
    ),

  async execute(client, interaction) {
    if (client.config.commands.music.search === 0) {
      return interaction.reply({ content: "❌  |  This command is disabled.", flags: MessageFlags.Ephemeral });
    }

    const query = interaction.options.getString("query");
    const platform = interaction.options.getString("platform") || "youtube";

    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply({ content : '❌  |  You are not connected to a voice channel!', flags: MessageFlags.Ephemeral});
    
    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
      return interaction.reply({ content: "❌  |  You must join in same vc to request song!", flags: MessageFlags.Ephemeral });
    }

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const player = await client.kazagumo.createPlayer({
      guildId: interaction.guild.id,
      textId: interaction.channel.id,
      voiceId: channel.id,
      deaf: true,
    });

    result = await client.kazagumo.search(query, { 
      engine: platform,
      requester: interaction.user 
    });

    if (client.debug === "player" || client.debug === "all") {
      console.log(`INFO (Player) :: Result tracks`);
      console.dir(result, { depth : 1 });
    }
    
    if (!result.tracks.length) return interaction.editReply("⚠️  |  Failed to get song. Try more specific!");

    let title, song, selectMenu;
    if (result.type == "PLAYLIST") {
      for (const track of result.tracks) {
        player.queue.add(track);
      }
      song = result.tracks[0];
      if (player.paused) {player.pause(false)}
      else if (!player.playing) {player.play()}

      let embed = new EmbedBuilder()      
      .setTitle("Playback Information")
      .setColor("Blue")
      .setDescription(
        `📝  |  **${result.type == "PLAYLIST" ? result.playlistName : title}** has been enqueued!
        ℹ️  |  Source : ${song.sourceName}
        ℹ️  |  ${result.type == "PLAYLIST" ? `Total song indexed : ${result.tracks.length}` : `Track Status : ${songIndex === 0 ? "Playing right now!" : `Added in position ${songIndex}`}`}`
      ); 

      return interaction.editReply({ embeds: [embed] });
    } else {
      let data = []

      for (let i = 0; i < (result.tracks.length >= 25 ? 25 : result.tracks.length); i++) {
        let dict = {
          label: result.tracks[i].title,
          description: result.tracks[i].author,
          value: i.toString()
        }

        data.push(dict);
      }

      selectMenu = new StringSelectMenuBuilder()
        .setCustomId("music-menu")
        .setPlaceholder("Select the music")
        .addOptions(data)
    }

    let songIndex = player.queue.size;

    let component = new ActionRowBuilder().addComponents(selectMenu);

    let embed = new EmbedBuilder()
      .setTitle("Playback Information")
      .setColor("Blue")
      .setDescription("ℹ️  |  Select the song first!\nAfter select the song, the music will automaticly play")

    await interaction.editReply({ embeds: [embed], components: [component] });
  },

  getResultData : () => {
    return result;
  }
};