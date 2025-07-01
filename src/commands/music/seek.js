const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("seek")
    .setDescription("Seeking the position of song.")
    .addIntegerOption(opt => opt
      .setName("sec")
      .setDescription("Position in seconds")
      .setRequired(true)
    )
    .addIntegerOption(opt => opt
      .setName("min")
      .setDescription("Position in minutes")
      .setRequired(false)
    )
    .addIntegerOption(opt => opt
      .setName("hrs")
      .setDescription("Position in hours")
      .setRequired(false)
    ),

  async execute(client, interaction) {
    if (client.config.commands.music.seek === 0) {
      return interaction.reply({ content: "❌  |  This command is disabled.", flags: MessageFlags.Ephemeral });
    }

    const player = client.kazagumo.players.get(interaction.guild.id);

    const sec = Number(interaction.options.getInteger("sec"));
    const min = Number(interaction.options.getInteger("min"));
    const hrs = Number(interaction.options.getInteger("hrs"));

    if (sec > 60) {
      return interaction.reply({ content : "❌  |  Max value of seconds is 60", flags: MessageFlags.Ephemeral });
    }

    if (min > 60) {
      return interaction.reply({ content : "❌  |  Max value of minutes is 60", flags: MessageFlags.Ephemeral });
    }

    if (hrs > 24) {
      return interaction.reply({ content : "❌  |  Max value of hours is 24", flags: MessageFlags.Ephemeral });
    }

    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply({ content: '❌  |  You are not connected to a voice channel!', flags: MessageFlags.Ephemeral });

    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
      return interaction.reply({ content: "❌  |  You must join in same vc to request song!", flags: MessageFlags.Ephemeral });
    }

    if (!player || !player.playing) return interaction.reply("❌  |  No song are playing.");

    let durationTime = (sec + (min * 60) + (hrs * 3600)) * 1000;

    let fmin;
    if (min < 10) fmin = "0" + min
    else fmin = min;

    let fsec;
    if (sec < 10) fsec = "0" + sec
    else fsec = sec;
    
    await player.seek(durationTime);
    
    const embed = new EmbedBuilder()
      .setTitle("Playback Information")
      .setColor("Blue")
      .setDescription(`✅  |  Seeked to ${!hrs ? "0" : hrs}:${!min ? "00" : fmin}:${sec === 0 ? "00" : fsec}!`);

    await interaction.reply({ embeds: [embed] });
  },
};
