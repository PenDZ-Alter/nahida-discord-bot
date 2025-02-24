const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data : new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stopping the player and delete queue"),

  async execute(client, interaction) {
    if (client.config.commands.music.stop === 0) {
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

    queue.delete();

    let embed = new EmbedBuilder()
      .setTitle("Playback Information")
      .setColor("Blue")
      .setDescription("✅  |  Player has been stopped!");

    await interaction.reply({ embed: [embed], ephemeral : false });
  }
}