<<<<<<< HEAD
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
=======
const { SlashCommandBuilder } = require("discord.js");
>>>>>>> 05c65fdf455789305ea8ade5808a41e08f723579
const { QueryType } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Playing a song")
    .addStringOption(opt =>
      opt.setName("query")
        .setDescription("Title or url of the song")
        .setRequired(true)
    ),

  async execute(client, interaction) {
    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply('❌  |  You are not connected to a voice channel!'); // make sure we have a voice channel
    const query = interaction.options.getString('query', true);
    await client.player.extractors.loadDefault();

    if (!interaction.member.voice.channel) return interaction.reply({ content: "❌  |  You must join vc first!", ephemeral: true });
    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
      return interaction.reply({ content: "❌  |  You must join in same vc to request song!", ephemeral: true })
    }

    const queue = client.player.nodes.create(interaction.guild, {
      volume : 90,
      metadata : {
        channel : interaction.channel,
        client : interaction.guild.members.me
      }
    });

    await interaction.deferReply({ ephemeral : true });

    try {
      if (!queue.connection) await queue.connect(channel);
    } catch (e) {
      return interaction.followUp(`❌  |  Something went wrong: ${e}`);
    }

    const result = await client.player.search(query, {
      requestedBy : interaction.user,
      searchEngine : QueryType.YOUTUBE_SEARCH
    });

    if (!result.hasTracks()) {
      return interaction.followUp("❌  |  Can't find the song! Try more specificly");
    };

    let title, track;
    if (result.playlist) {
      queue.addTrack(result.tracks);
      title = result.playlist.title;
    } else {
      track = result.tracks[0];

      queue.addTrack(track);
      title = track.title;
    }
    
    if (!queue.node.isPlaying()) await queue.node.play();

<<<<<<< HEAD
    let embed = new EmbedBuilder()
      .setTitle("Playback Information")
      .setColor("Blue")
      .setDescription(`📝  |  **${title}** has been enqueued!\nℹ️  |  Source : ${track.source}`);

    await interaction.editReply({ embeds : [embed] });
=======
    await interaction.followUp(`📝  |  **${title}** has been enqueued!\nℹ️  |  Source : ${track.source}`);
>>>>>>> 05c65fdf455789305ea8ade5808a41e08f723579
  }
}