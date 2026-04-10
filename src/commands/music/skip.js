const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Go to the next song."),

  async execute(client, interaction) {
    if (client.config.commands.music.skip === 0) {
      return interaction.reply({ content: "❌  |  This command is disabled.", flags: MessageFlags.Ephemeral });
    }

    const player = client.kazagumo.players.get(interaction.guild.id);
    let queue = player.queue;

    if (client.debug === "player" || client.debug === "all") {
      console.log("INFO (Player) :: Queue Info");
      console.dir(queue, { depth : 1 });
    }

    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply({ content : '❌  |  You are not connected to a voice channel!', flags: MessageFlags.Ephemeral});
    
    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
      return interaction.reply({ content: "❌  |  You must join in same vc to request song!", flags: MessageFlags.Ephemeral });
    }

    if (!player || !player.playing) return interaction.reply("❌  |  No song are playing.");

    let currentSong = queue.current.title;
    let nextSong = queue[0]?.title;

    if (!nextSong) {
      player.skip();
      player.destroy();
      const embed = new EmbedBuilder()
        .setTitle("Playback Information")
        .setColor("Red")
        .setDescription(`⏭️ The song **${currentSong}** has been skipped!\n📭 No more songs in queue. Player has been stopped!`);

      return interaction.reply({ embeds: [embed] });
    }

    player.skip();
    const embed = new EmbedBuilder()
      .setTitle("Playback Information")
      .setColor("Blue")
      .setDescription(`⏭️ The song **${currentSong}** has been skipped!\n🎵 Now Playing **${nextSong}**`);

    await interaction.reply({ embeds: [embed] });
  },
};
