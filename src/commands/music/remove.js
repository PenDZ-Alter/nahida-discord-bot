const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data : new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove song from index")
    .addIntegerOption(
      opt => opt
        .setName("index")
        .setDescription("Number of index")
        .setRequired(true)  
    )
    .addIntegerOption(
      opt => opt
        .setName("end")
        .setDescription("End of tracks (optional, if you want to remove more than 1)")
        .setRequired(false)
    ),

  async execute(client, interaction) {
    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply({ content : '❌  |  You are not connected to a voice channel!', ephemeral : true});
    const queue = client.player.nodes.get(interaction.guild);

    const index = Number(interaction.options.getInteger("index"));
    const endIndex = Number(interaction.options.getInteger("end"));

    if (!interaction.member.voice.channel) return interaction.reply({ content: "❌  |  You must join vc first!", ephemeral: true });
    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
      return interaction.reply({ content: "❌  |  You must join in same vc to request song!", ephemeral: true })
    }

    if (!queue) return interaction.reply({ content : "❌  |  Can't get player from your guild!", ephemeral : true });
    if (!queue.node.isPlaying()) return interaction.reply({ content : "❌  |  You're not playing the song", ephemeral : true });
  
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
      await queue.node.remove(index-1);
      ctx = `✅  |  Removed track ${index} from queue!`;
    }

    await interaction.reply({ content : ctx, ephemeral : false });
  }
}