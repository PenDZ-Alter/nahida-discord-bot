const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require("discord.js");
const { QueryType } = require("discord-player");

let result;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Search a song and play it")
    .addStringOption(opt =>
      opt.setName("query")
        .setDescription("Title or url of the song")
        .setRequired(true)
    )
    .addStringOption(opt => opt
      .setName("type")
      .setDescription("Select platform of stream")
      .setRequired(false)
      .addChoices(
        {name : "youtube", value : QueryType.YOUTUBE_SEARCH},
        {name : "spotify", value : QueryType.SPOTIFY_SEARCH},
        {name : "soundcloud", value : QueryType.SOUNDCLOUD_SEARCH},
        {name : "apple", value : QueryType.APPLE_MUSIC_SEARCH},
        {name : "playlist", value : QueryType.AUTO},
        {name : "soundcloud_playlist", value : QueryType.SOUNDCLOUD_PLAYLIST},
        {name : "auto", value : QueryType.AUTO_SEARCH}
      )
    ),

  async execute(client, interaction) {
    if (client.config.commands.music.search === 0) {
      return interaction.reply({ content: "❌  |  This command is disabled.", ephemeral: true });
    }

    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply({ content : '❌  |  You are not connected to a voice channel!', ephemeral : true});
    
    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
      return interaction.reply({ content: "❌  |  You must join in same vc to request song!", ephemeral: true });
    }

    const query = interaction.options.getString('query', true);
    const type = interaction.options.getString('type');

    const queue = client.player.nodes.create(interaction.guild, {
      volume : 90,
      metadata : {
        channel : interaction.channel,
        client : interaction.guild.members.me
      }
    });

    if (type) {
      result = await client.player.search(query, {
        requestedBy : interaction.user,
        searchEngine : type
      });
    } else {
      result = await client.player.search(query, {
        requestedBy : interaction.user,
        searchEngine : QueryType.YOUTUBE_SEARCH
      });
    }

    await interaction.deferReply({ ephemeral : true });

    try {
      if (!queue.connection) await queue.connect(channel);
    } catch (e) {
      return interaction.followUp(`❌  |  Something went wrong: ${e}`);
    }    

    if (!result.hasTracks()) {
      return interaction.followUp("❌  |  Can't find the song! Try more specificly");
    };

    let title, isPlaylist, sizePlaylist, selectMenu;
    if (result.playlist) {
      queue.addTrack(result.tracks);
      title = result.playlist.title;
      
      isPlaylist = true;
      sizePlaylist = result.tracks.length;

      let embed = new EmbedBuilder()
        .setTitle("Playback Information")
        .setColor("Blue")
        .setDescription(
          `📝  |  **${title}** has been enqueued!
          ℹ️  |  Source : ${!result.playlist ? track.source : "Playlist"}
          ℹ️  |  ${!result.playlist ? `Track Status : ${songIndex === 0 ? "Playing right now!" : `Added in position ${songIndex}`}` : `Total song indexed : ${sizePlaylist}`}`);

      return interaction.editReply({ embeds: [embed] });
    } else {
      isPlaylist = false
      let data = [];

      for (let i = 0; i < 7; i++) {
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

    let component = new ActionRowBuilder().addComponents(selectMenu);

    let embed = new EmbedBuilder()
      .setTitle("Playback Information")
      .setColor("Blue")
      .setDescription("ℹ️  |  Select the song first!\nAfter select the song, the music will automaticly play")

    await interaction.editReply({ embeds: [embed], components: [component] });
  },

  getResultData: () => {
    return result;
  }
}
