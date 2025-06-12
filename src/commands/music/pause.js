const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pause or resume the song"),

  async execute(client, interaction) {
    if (client.config.commands.music.pause === 0) {
      return interaction.reply({ content: "❌  |  This command is disabled.", ephemeral: true });
    }

    const player = client.kazagumo.players.get(interaction.guild.id);

    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply({ content : '❌  |  You are not connected to a voice channel!', ephemeral : true});

    if (!interaction.member.voice.channel) return interaction.reply({ content: "❌  |  You must join vc first!", ephemeral: true });
    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
      return interaction.reply({ content: "❌  |  You must join in same vc to request song!", ephemeral: true })
    }

    if (!player) return interaction.reply({ content : "❌  |  You're not playing music rn!", ephemeral : true });

    if (player.paused) {
      await player.pause(false);
      return interaction.reply({ content : "✅  |  Resumed the song!", ephemeral : false });
    } else {
      await player.pause(true);
      return interaction.reply({ content : "✅  |  Paused the song!", ephemeral : false });
    }

  },
};
