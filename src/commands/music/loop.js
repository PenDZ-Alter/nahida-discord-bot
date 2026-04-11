const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("repeat")
    .setDescription("Looping the song")
    .addStringOption(opt => opt
      .setName("category")
      .setDescription("Toggle the repeat mode")
      .setRequired(true)
      .addChoices(
        { name: "track", value: "track" },
        { name: "queue", value: "queue" },
        { name: "off", value: "none" },
      )
    ),

  async execute(client, interaction) {
    if (client.config.commands.music.repeat === 0) {
      return interaction.reply({ content: "❌  |  This command is disabled.", flags: MessageFlags.Ephemeral });
    }

    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply({ content: '❌  |  You are not connected to a voice channel!', flags: MessageFlags.Ephemeral });
    const player = client.kazagumo.players.get(interaction.guild.id);
    const type = interaction.options.getString("category");

    if (!interaction.member.voice.channel) return interaction.reply({ content: "❌  |  You must join vc first!", flags: MessageFlags.Ephemeral });
    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
      return interaction.reply({ content: "❌  |  You must join in same vc to request song!", flags: MessageFlags.Ephemeral })
    }

    if (!player || !player.playing) return interaction.reply({ content: "❌  |  You're not playing music rn!", flags: MessageFlags.Ephemeral });

    await player.setLoop(type);

    await interaction.reply({ content: `✅  |  Toggled repeat mode to ${type}!`, flags: 0 });
  },
}