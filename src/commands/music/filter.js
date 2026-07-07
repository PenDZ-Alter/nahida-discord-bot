const { SlashCommandBuilder, MessageFlags, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("filter")
    .setDescription("Adding filter to player")
    .addStringOption(
      opt => opt
        .setName("type")
        .setDescription("Select filters")
        .setRequired(true)
        .addChoices(
          { name: "Clear", value: "clear" },
          { name: "Tremolo", value: "tremolo" },
          { name: "Nightcore", value: "nightcore" },
          { name: "Vibrato", value: "vibrato" },
          { name: "Slow", value: "slow" },
          { name: "Daycore", value: "daycore" },
        )
    ),

  async execute(client, interaction) {
    if (client.config.commands.music.filter === 0) {
      return interaction.reply({ content: "❌  |  This command is disabled.", flags: MessageFlags.Ephemeral });
    }

    const player = client.kazagumo.players.get(interaction.guild.id);
    const filter = interaction.options.getString("type");

    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply({ content : '❌  |  You are not connected to a voice channel!', ephemeral : true});

    if (!interaction.member.voice.channel) return interaction.reply({ content: "❌  |  You must join vc first!", flags: MessageFlags.Ephemeral });
    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
      return interaction.reply({ content: "❌  |  You must join in same vc to request song!", flags: MessageFlags.Ephemeral })
    }

    try {
      if (client.debug == 'player' || client.debug == 'all') console.log(`INFO (Player) :: Trying to set filter to ${filter}`)
      await player.filter(filter);
      if (client.debug == 'player' || client.debug == 'all') {
        console.log(`INFO (Player) :: Active Filter`);
        console.log(player.filters);
      }
    } catch (err) {
      console.log("ERR :: Error Founded in player!");
      if (client.debug == 'player' || client.debug == 'all') console.error(err);
    }

    const embed = new EmbedBuilder()
      .setTitle("Playback Information")
      .setColor("Blue")
      .setDescription(`🎵 Filter set to **${filter}**`);

    await interaction.reply({ embeds: [embed] });
  },
};
