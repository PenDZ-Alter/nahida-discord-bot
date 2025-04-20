const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Playing song from youtube")
    .addStringOption(option =>
      option.setName("query")
        .setDescription("Query of song")
        .setRequired(true)),

  async execute(client, interaction) {
    const query = interaction.options.getString("query");

    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply({ content : '❌  |  You are not connected to a voice channel!', ephemeral : true});
    
    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
      return interaction.reply({ content: "❌  |  You must join in same vc to request song!", ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });

    const player = await client.kazagumo.createPlayer({
      guildId: interaction.guild.id,
      textId: interaction.channel.id,
      voiceId: channel.id,
      deaf: true,
    });

    const result = await client.kazagumo.search(query, { requester: interaction.user });
    if (!result.tracks.length) return interaction.editReply("⚠️  |  Failed to get song. Try more specific!");

    let title, song;
    if (result.type == "PLAYLIST") {
      for (const track of result.tracks) {
        player.queue.add(track);
      }
      if (!player.playing) player.play();
      song = result.tracks[0];
    } else {
      player.queue.add(result.tracks[0]);
      if (!player.playing) player.play();
      title = result.tracks[0].title;
      song = result.tracks[0];
    }

    let songIndex = player.queue.size;

    if (client.config.debug === "player" || client.config.debug === "all") {
      console.log(`INFO (Player) :: Result tracks`);
      console.dir(result, { depth : 1 });
    }

    let embed = new EmbedBuilder()      
      .setTitle("Playback Information")
      .setColor("Blue")
      .setDescription(
        `📝  |  **${result.type == "PLAYLIST" ? result.playlistName : title}** has been enqueued!
        ℹ️  |  Source : ${song.sourceName}
        ℹ️  |  ${result.type == "PLAYLIST" ? `Total song indexed : ${result.tracks.length}` : `Track Status : ${songIndex === 0 ? "Playing right now!" : `Added in position ${songIndex}`}`}`
      );
    await interaction.editReply({ embeds: [embed] });
  },
};
