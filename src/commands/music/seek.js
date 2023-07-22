const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data : new SlashCommandBuilder()
    .setName("seek")
    .setDescription("Seeking into specified duration")
    .addIntegerOption(opt => 
      opt.setName("sec")
        .setDescription("Number of duration in seconds (set 0 if you dont need it!)")
        .setRequired(true)
    )
    .addIntegerOption(opt => 
      opt.setName("min")
        .setDescription("Number of duration in minutes")
        .setRequired(false)
    )
    .addIntegerOption(opt =>
      opt.setName('hrs')
        .setDescription("Number of duration in hours")
        .setRequired(false)
    ),

  async execute(client, interaction) {
    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply('❌  |  You are not connected to a voice channel!');
    const queue = client.player.nodes.get(interaction.guild);

    // Getting time from interaction options
    const sec = Number(interaction.options.getInteger("sec"));
    const min = Number(interaction.options.getInteger("min"));
    const hrs = Number(interaction.options.getInteger("hrs"));

    if (sec > 60) {
      return interaction.reply({ content : "❌  |  Max value of seconds is 60", ephemeral : true });
    }

    if (min > 60) {
      return interaction.reply({ content : "❌  |  Max value of minutes is 60", ephemeral : true });
    }

    if (hrs > 24) {
      return interaction.reply({ content : "❌  |  Max value of hours is 24", ephemeral : true });
    }

    let durationTime = (sec + (min * 60) + (hrs * 3600)) * 1000;

    if (!interaction.member.voice.channel) return interaction.reply({ content: "❌  |  You must join vc first!", ephemeral: true });
    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
      return interaction.reply({ content: "❌  |  You must join in same vc to request song!", ephemeral: true })
    }

    if (!queue) return interaction.reply({ content : "❌  |  Can't get player from your guild!", ephemeral : true });
    if (!queue.node.isPlaying())
      return interaction.reply({ content : "❌  |  The player is not playing the song!", ephemeral : true });

    queue.node.seek(durationTime);

    await interaction.reply({ content : `✅  |  Seeked to ${!hrs ? "0" : hrs}:${!min ? "0" : min}:${sec === 0 ? "0" : sec}!`, ephemeral : true });
  }
}