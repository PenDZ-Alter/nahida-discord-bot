const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { QueryType } = require("discord-player");
const { setIsPlaylist, setIsInsert } = require("../music/play.js");

let songIndex, isPlaylist, sizePlaylist, getIndex;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("insert")
    .setDescription("Add song with specified index")
    .addStringOption(opt =>opt
      .setName("query")
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
        {name : "youtube", value : QueryType.YOUTUBE_SEARCH},
        {name : "spotify", value : QueryType.SPOTIFY_SEARCH},
        {name : "soundcloud", value : QueryType.SOUNDCLOUD_SEARCH},
        {name : "apple", value : QueryType.APPLE_MUSIC_SEARCH},
        {name : "playlist", value : QueryType.AUTO},
        {name : "auto", value : QueryType.AUTO}
      )
    ),

  async execute(client, interaction) {
    if (client.config.commands.music.insert === 0) {
      return interaction.reply({ content: "❌  |  This command is disabled.", ephemeral: true });
    }

    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply({ content : '❌  |  You are not connected to a voice channel!', ephemeral : true});
    
    const query = interaction.options.getString('query', true);
    const type = interaction.options.getString('type');
    const index = interaction.options.getInteger('number');
    getIndex = index;

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

    let result;
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

    let title, track;
    if (result.playlist) {
      queue.insertTrack(result.tracks, index-1);
      title = result.playlist.title;
      isPlaylist = true;
      sizePlaylist = result.tracks.length;
      setIsPlaylist(true)
    } else {
      track = result.tracks[0];

      queue.insertTrack(track, index-1);
      title = track.title;
      isPlaylist = false;
      setIsPlaylist(false)
    }
    
    if (!queue.node.isPlaying()) 
      await queue.node.play();

    const button = new ButtonBuilder()
      .setCustomId('cancel-add')
      .setLabel("Cancel")
      .setStyle(ButtonStyle.Danger)
      .setDisabled(false)

    songIndex = queue.getSize();

    setIsInsert(true);
    
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

  getIndex : () => {
    return getIndex;
  }
}