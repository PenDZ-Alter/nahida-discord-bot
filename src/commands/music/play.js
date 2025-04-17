const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

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

    let totalSong, title;
    if (result.type == "PLAYLIST") {
      for (const track of result.tracks) {
        player.queue.add(track);
        totalSong += 1;
      }
      if (!player.playing) player.play();
      // return interaction.editReply(`📜 Playlist added: **${result.playlistName}**`);
    } else {
      player.queue.add(result.tracks[0]);
      if (!player.playing) player.play();
      title = result.tracks[0].title;
      // return interaction.editReply(`🎧 Song Added: **${result.tracks[0].title}**`);
    }

    let songIndex = player.queue.size;

    let embed = new EmbedBuilder()      
      .setTitle("Playback Information")
      .setColor("Blue")
      .setDescription(
        `📝  |  **${title}** has been enqueued!
        ℹ️  |  Source : ${result.type == "SEARCH" ? "Tracks" : "Playlist"}
        ℹ️  |  ${result.type == "SEARCH" ? `Track Status : ${songIndex === 0 ? "Playing right now!" : `Added in position ${songIndex}`}` : `Total song indexed : ${totalSong}`}`);

    await interaction.editReply({ embeds: [embed] });
  },
};
