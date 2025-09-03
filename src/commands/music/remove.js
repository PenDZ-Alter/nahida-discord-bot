const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove song from queue.")
    .addIntegerOption(opt => opt
      .setName("number")
      .setDescription("Number of song, also, it can be the start song to remove")
      .setRequired(true)
    )
    .addIntegerOption(opt => opt
      .setName("end")
      .setDescription("End song number to remove")
      .setRequired(false)
    ),

  async execute(client, interaction) {
    if (client.config.commands.music.remove === 0) {
      return interaction.reply({ content: "❌  |  This command is disabled.", flags: MessageFlags.Ephemeral });
    }

    const player = client.kazagumo.players.get(interaction.guild.id);
    let queue = player.queue;

    const index = interaction.options.getInteger("number");
    const endIndex = interaction.options.getInteger("end");

    if (client.debug === "player" || client.debug === "all") {
      console.log("INFO (Player) :: Queue Info");
      console.dir(queue, { depth : 1 });
    }

    if (endIndex && index > endIndex) 
      return interaction.reply({ content: '❌  |  Invalid number of start and end, end number must be higher dan start', flags: MessageFlags.Ephemeral });

    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply({ content : '❌  |  You are not connected to a voice channel!', flags: MessageFlags.Ephemeral});
    
    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
      return interaction.reply({ content: "❌  |  You must join in same vc to request song!", flags: MessageFlags.Ephemeral });
    }

    if (!player || !player.playing) return interaction.reply("❌  |  No song are playing.");

    let ctx;

    if (endIndex) {
      let i = endIndex - 1;
      while (i >= index - 1) {
        await queue.remove(i);
        i--; // Decrement end because the queue shrinks after each removal
      }

      ctx = `✅  |  Removed ${index}-${endIndex} tracks from queue!`
    } else {
      let songTitleRemoval = queue[index-1]?.title;

      await queue.remove(index-1);
      ctx = `✅  |  Removed track **${songTitleRemoval}** from queue!`;
    }

    const embed = new EmbedBuilder()
      .setTitle("Playback Information")
      .setColor("Blue")
      .setDescription(ctx);

    await interaction.reply({ embeds: [embed] });
  },
};
