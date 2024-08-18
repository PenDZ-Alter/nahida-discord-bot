const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data : new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove song from queue")
    .addIntegerOption(
      opt => opt
        .setName("number")
        .setDescription("Number of queue")
        .setRequired(true)  
    )
    .addIntegerOption(
      opt => opt
        .setName("end")
        .setDescription("End of tracks (optional, if you want to remove more than 1)")
        .setRequired(false)
    ),

  async execute(client, interaction) {
    if (client.config.commands.music.remove === 0) {
      return interaction.reply({ content: "❌  |  This command is disabled.", ephemeral: true });
    }

    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply({ content : '❌  |  You are not connected to a voice channel!', ephemeral : true});
    const queue = client.player.nodes.get(interaction.guild);

    const index = Number(interaction.options.getInteger("number"));
    const endIndex = Number(interaction.options.getInteger("end"));

    if (!interaction.member.voice.channel) return interaction.reply({ content: "❌  |  You must join vc first!", ephemeral: true });
    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
      return interaction.reply({ content: "❌  |  You must join in same vc to request song!", ephemeral: true })
    }

    if (!queue || !queue.node.isPlaying()) return interaction.reply({ content : "❌  |  You're not playing music rn!", ephemeral : true });
  
    if (index > queue.tracks.length)
      return interaction.reply({ content : "❌  |  Invalid Index", ephemeral : true });

    let ctx;
    if (endIndex) {
      if (index > endIndex) {
        return interaction.reply({ content : "❌  |  Invalid index, the index should be lower than end!!", ephemeral : true });
      }

      let i = endIndex - 1;
      while (i >= index - 1) {
        await queue.node.remove(i);
        i--; // Decrement end because the queue shrinks after each removal
      }

      ctx = `✅  |  Removed ${index}-${endIndex} tracks from queue!`;
    } else {
      let songTitleRemoval = queue.tracks.data[index-1].title;

      await queue.node.remove(index-1);
      ctx = `✅  |  Removed track **${songTitleRemoval}** from queue!`;
    }

    await interaction.reply({ content : ctx, ephemeral : false });
  }
}