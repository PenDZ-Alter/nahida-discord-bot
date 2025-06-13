const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skipto")
    .setDescription("Go to the next song with position based on queue.")
    .addIntegerOption(opt => opt
      .setName("target")
      .setDescription("Target Position")
      .setRequired(true)
    ),

  async execute(client, interaction) {
    if (client.config.commands.music.skipto === 0) {
      return interaction.reply({ content: "❌  |  This command is disabled.", ephemeral: true });
    }

    const player = client.kazagumo.players.get(interaction.guild.id);
    let queue = player.queue;

    const targetIndex = interaction.options.getInteger("target")-1;

    if (client.config.debug === "player" || client.config.debug === "all") {
      console.log("INFO (Player) :: Queue Info");
      console.dir(queue, { depth: 1 });
    }

    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply({ content: '❌  |  You are not connected to a voice channel!', ephemeral: true });

    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
      return interaction.reply({ content: "❌  |  You must join in same vc to request song!", ephemeral: true });
    }

    if (!player || !player.playing) return interaction.reply("❌  |  No song are playing.");

    let currentSong = queue.current.title;
    let nextSong = queue[targetIndex]?.title;

    if (!nextSong) {
      player.skip();
      player.destroy();
      const embed = new EmbedBuilder()
        .setTitle("Playback Information")
        .setColor("Red")
        .setDescription(`⏭️ The song **${currentSong}** has been skipped!\n📭 No more songs in queue. Player has stopped.`);

      return interaction.reply({ embeds: [embed] });
    }

    player.queue.splice(0, targetIndex);
    player.skip();
    const embed = new EmbedBuilder()
      .setTitle("Playback Information")
      .setColor("Blue")
      .setDescription(`⏭️ The song **${currentSong}** has been skipped!\n🎵 Now Playing **${nextSong}**\n📭 Skipped to song at position **${targetIndex+1}**`);

    await interaction.reply({ embeds: [embed] });
  },
};
