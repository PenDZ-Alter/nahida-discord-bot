const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { QueryType } = require("discord-player");

let songIndex, isPlaylist, sizePlaylist, isInsert, getIndex;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("insert")
    .setDescription("Add song with specified index")
    .addStringOption(opt =>
      opt.setName("query")
        .setDescription("Title or url of the song")
        .setRequired(true)
    )
    .addIntegerOption(opt => opt
      .setName("number")
      .setDescription("Number of queue to insert")
      .setRequired(true)
    )
    .addStringOption(opt => opt
      .setName("type")
      .setDescription("Select platform of stream")
      .setRequired(false)
      .addChoices(
        {name : "youtube", value : "yt"},
        {name : "spotify", value : "sp"},
        {name : "soundcloud", value : "sc"},
        {name : "playlist", value : "pl"},
        {name : "auto", value : "auto"}
      )
    ),

  async execute(client, interaction) {
    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply({ content : '❌  |  You are not connected to a voice channel!', ephemeral : true});
    
    const query = interaction.options.getString('query', true);
    const type = interaction.options.getString('type');
    const index = interaction.options.getInteger('number');
    getIndex = index;
    await client.player.extractors.loadDefault();

    if (!interaction.member.voice.channel) return interaction.reply({ content: "❌  |  You must join vc first!", ephemeral: true });
    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
      return interaction.reply({ content: "❌  |  You must join in same vc to request song!", ephemeral: true })
    }

    if (index < 1) {
      return interaction.reply({ content: "❌  |  You can't insert number below 1!!", ephemeral: true });
    } 

    const queue = client.player.nodes.create(interaction.guild, {
      volume : 90,
      metadata : {
        channel : interaction.channel,
        client : interaction.guild.members.me
      }
    });
    isInsert = true;

    let result;
    switch (type) {
      case "yt" :
        result = await client.player.search(query, {
          requestedBy : interaction.user,
          searchEngine : QueryType.YOUTUBE_SEARCH
        });
        break;

      case "sp" :
        result = await client.player.search(query, {
          requestedBy : interaction.user,
          searchEngine : QueryType.SPOTIFY_SEARCH
        });
        break;

      case "sc" :
        result = await client.player.search(query, {
          requestedBy : interaction.user,
          searchEngine : QueryType.SOUNDCLOUD_SEARCH
        });
        break;

      case "pl" :
        result = await client.player.search(query, {
          requestedBy : interaction.user,
          searchEngine : QueryType.AUTO
        });
        break;

      case "auto" :
        result = await client.player.search(query, {
          requestedBy : interaction.user,
          searchEngine : QueryType.AUTO
        });
        break;

      default : 
        result = await client.player.search(query, {
          requestedBy : interaction.user,
          searchEngine : QueryType.YOUTUBE_SEARCH
        });
        break;
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

    let title, track;
    if (result.playlist) {
      queue.insertTrack(result.tracks, index-1);
      title = result.playlist.title;
      isPlaylist = true;
      sizePlaylist = result.tracks.length;
    } else {
      track = result.tracks[0];

      queue.insertTrack(track, index-1);
      title = track.title;
      isPlaylist = false;
    }
    
    if (!queue.node.isPlaying()) 
      await queue.node.play();

    const button = new ButtonBuilder()
      .setCustomId('cancel-add')
      .setLabel("Cancel")
      .setStyle(ButtonStyle.Danger)
      .setDisabled(false)

    songIndex = queue.getSize();
    
    let embed = new EmbedBuilder()
      .setTitle("Playback Information")
      .setColor("Blue")
      .setDescription(
        `📝  |  **${title}** has been enqueued!
        ℹ️  |  Source : ${!result.playlist ? track.source : "Playlist"}
        ℹ️  |  ${!result.playlist ? `Track Status : ${songIndex === 0 ? "Playing right now!" : `Indexed in position ${index}`}` : `Total song indexed : ${sizePlaylist}`}`);

    if (songIndex === 0) {
      await interaction.editReply({ embeds : [embed] });
    } else {
      const actionRow = new ActionRowBuilder().addComponents(button)
      await interaction.editReply({ embeds : [embed], components : [actionRow] });

      setTimeout(() => {
        button.setDisabled(true);
        interaction.editReply({ components : [actionRow] });
      }, 3000);
    }
  },

  getAddedIndex : () => {
    return songIndex;
  },

  getIsPlaylist : () => {
    return isPlaylist;
  },

  getSizePlaylist : () => {
    return sizePlaylist;
  }, 

  getIsInsert : () => {
    return isInsert;
  },

  getIndex : () => {
    return getIndex;
  }
}

// Tasks!
// There's a bug when cancelling add music