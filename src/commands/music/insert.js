const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("insert")
    .setDescription("Playing song from youtube with set position")
    .addStringOption(option =>
      option.setName("query")
        .setDescription("Query of song")
        .setRequired(true))
    .addIntegerOption(opt => opt
      .setName("position")
      .setDescription("Position to insert based on Queue")
      .setRequired(true)
    ),

  async execute(client, interaction) {
    if (client.config.commands.music.insert === 0) {
      return interaction.reply({ content: "❌  |  This command is disabled.", ephemeral: true });
    }

    const query = interaction.options.getString("query");
    const position = interaction.options.getInteger("position")-1;

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
      song = result.tracks[0];
      player.queue.splice(position, 0, ...result.tracks);
      if (player.paused) {player.pause(false)}
      else if (!player.playing) {player.play()}
    } else {
      title = result.tracks[0].title;
      song = result.tracks[0];
      player.queue.splice(position, 0, song);
      if (player.paused) {player.pause(false)}
      else if (!player.playing) {player.play()}
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
        ℹ️  |  ${result.type == "PLAYLIST" ? `Total song indexed : ${result.tracks.length}` : `Track Status : ${songIndex === 0 ? "Playing right now!" : `Added in position ${position+1}`}`}`
      );
    await interaction.editReply({ embeds: [embed] });
  },
};
