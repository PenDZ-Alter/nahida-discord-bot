const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data : new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pause the player"),

  async execute(client, interaction) {
    if (client.config.commands.music.pause === 0) {
      return interaction.reply({ content: "❌  |  This command is disabled.", ephemeral: true });
    }

    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply({ content : '❌  |  You are not connected to a voice channel!', ephemeral : true});
    const queue = client.player.nodes.get(interaction.guild);

    if (!interaction.member.voice.channel) return interaction.reply({ content: "❌  |  You must join vc first!", ephemeral: true });
    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
      return interaction.reply({ content: "❌  |  You must join in same vc to request song!", ephemeral: true })
    }

    if (!queue || !queue.node.isPlaying()) return interaction.reply({ content : "❌  |  You're not playing music rn!", ephemeral : true });

    if (queue.node.isPaused())
      return interaction.reply({ content : "❌  |  The player is already paused!", ephemeral : true });

    await queue.node.pause();

    await interaction.reply({ content : "✅  |  Paused the song!", ephemeral : false });
  }
}