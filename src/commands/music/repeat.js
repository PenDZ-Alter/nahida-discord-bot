const { SlashCommandBuilder } = require("discord.js");
const { QueueRepeatMode } = require("discord-player");

let status;

module.exports = {
  data : new SlashCommandBuilder()
    .setName("repeat")
    .setDescription("Looping the song")
    .addStringOption(opt => opt
      .setName("category")
      .setDescription("Toggle the repeat mode")
      .setRequired(true)
      .addChoices(
        { name : "track", value : "TRACK" },
        { name : "queue", value : "QUEUE" },
        { name : "autoplay", value : "AUTO" },
        { name : "off", value : "OFF" },
      )
    ),

  async execute(client, interaction) {
    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply({ content : '❌  |  You are not connected to a voice channel!', ephemeral : true});
    const queue = client.player.nodes.get(interaction.guild);
    const type = interaction.options.getString("category");

    if (!interaction.member.voice.channel) return interaction.reply({ content: "❌  |  You must join vc first!", ephemeral: true });
    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
      return interaction.reply({ content: "❌  |  You must join in same vc to request song!", ephemeral: true })
    }

    if (!queue) return interaction.reply({ content : "❌  |  Can't get player from your guild!", ephemeral : true });
    if (!queue.node.isPlaying()) return interaction.reply({ content : "❌  |  You're not playing the song", ephemeral : true });

    let loopText = type;
    if (type === "TRACK") {
      try {
        await queue.setRepeatMode(QueueRepeatMode.TRACK);
      } catch {
        return interaction.reply({
          content : '❌  |  Something went wrong, while toggling repeat mode!',
          ephemeral : true
        });
      }
    } else if (type === "QUEUE") {
      try {
        await queue.setRepeatMode(QueueRepeatMode.QUEUE);
      } catch {
        return interaction.reply({
          content : '❌  |  Something went wrong, while toggling repeat mode!',
          ephemeral : true
        });
      }
    } else if (type === "AUTO") {
      try {
        await queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
      } catch {
        return interaction.reply({
          content : '❌  |  Something went wrong, while toggling repeat mode!',
          ephemeral : true
        });
      }
    } else if (type === "OFF") {
      try {
        await queue.setRepeatMode(QueueRepeatMode.OFF);
      } catch {
        return interaction.reply({
          content : '❌  |  Something went wrong, while toggling repeat mode!',
          ephemeral : true
        });
      }
    }

    status = type;

    await interaction.reply({ content : `✅  |  Toggled repeat mode to ${loopText}!`, ephemeral : false });
  },

  repeatStatus : () => {
    return status;
  }
}