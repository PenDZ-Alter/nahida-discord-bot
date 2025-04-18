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
    const member = interaction.member;

    const voiceChannel = member.voice.channel;
    if (!voiceChannel) return interaction.reply({ content: "❌ Join voice channel first!", ephemeral: true });

    await interaction.deferReply({ ephemeral: true });

    const player = await client.kazagumo.createPlayer({
      guildId: interaction.guild.id,
      textId: interaction.channel.id,
      voiceId: voiceChannel.id,
      deaf: true,
    });

    const result = await client.kazagumo.search(query, { requester: interaction.user });
    if (!result.tracks.length) return interaction.editReply("⚠️ Failed to get song. Try more specific!");

    let totalSong, title, song;
    if (result.type == "PLAYLIST") {
      for (const track of result.tracks) {
        player.queue.add(track);
        totalSong += 1;
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
        `📝  |  **${title}** has been enqueued!
        ℹ️  |  Source : ${song.sourceName}
        ℹ️  |  ${result.type == "PLAYLIST" ? `Total song indexed : ${totalSong}` : `Track Status : ${songIndex === 0 ? "Playing right now!" : `Added in position ${songIndex}`}`}`
      );
    await interaction.editReply({ embeds: [embed] });
  },
};
