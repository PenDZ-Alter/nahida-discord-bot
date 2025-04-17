const { SlashCommandBuilder } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Mainin lagu dari YouTube")
    .addStringOption(option =>
      option.setName("query")
        .setDescription("Judul atau URL lagu")
        .setRequired(true)),

  async execute(client, interaction) {
    const query = interaction.options.getString("query");
    const member = interaction.member;

    const voiceChannel = member.voice.channel;
    if (!voiceChannel) return interaction.reply({ content: "❌ Lo harus join voice channel dulu!", ephemeral: true });

    await interaction.deferReply();

    const player = await client.kazagumo.createPlayer({
      guildId: interaction.guild.id,
      textId: interaction.channel.id,
      voiceId: voiceChannel.id,
      deaf: true,
    });

    const result = await client.kazagumo.search(query, { requester: interaction.user });
    if (!result.tracks.length) return interaction.editReply("⚠️ Gagal cari lagu.");

    if (result.type === "PLAYLIST") {
      for (const track of result.tracks) player.queue.add(track);
      if (!player.playing) player.play();
      return interaction.editReply(`📜 Playlist ditambahin: **${result.playlistName}**`);
    } else {
      player.queue.add(result.tracks[0]);
      if (!player.playing) player.play();
      return interaction.editReply(`🎧 Lagu ditambahin: **${result.tracks[0].title}**`);
    }
  },
};
