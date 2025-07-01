const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Playing song from youtube")
    .addStringOption(option =>
      option.setName("query")
        .setDescription("Query of song")
        .setRequired(true)),

  async execute(client, interaction) {
    if (client.config.commands.music.play === 0) {
      return interaction.reply({ content: "❌  |  This command is disabled.", flags: MessageFlags.Ephemeral });
    }

    const query = interaction.options.getString("query");

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

    const result = await client.kazagumo.search(query, { requester: interaction.user });
    if (!result.tracks.length) return interaction.editReply("⚠️  |  Failed to get song. Try more specific!");

    let title, song;
    if (result.type == "PLAYLIST") {
      for (const track of result.tracks) {
        player.queue.add(track);
      }
      song = result.tracks[0];
      if (player.paused) {player.pause(false)}
      else if (!player.playing) {player.play()}
    } else {
      player.queue.add(result.tracks[0]);
      title = result.tracks[0].title;
      song = result.tracks[0];
      if (player.paused) {player.pause(false)}
      else if (!player.playing) {player.play()}
    }

    let songIndex = player.queue.size;

    if (client.debug === "player" || client.debug === "all") {
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
