const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { repeatStatus } = require("./repeat.js");

module.exports = {
  data : new SlashCommandBuilder()
    .setName("info")
    .setDescription("Showing the info of track that currently playing"),

  async execute(client, interaction) {
    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply('❌  |  You are not connected to a voice channel!');
    const queue = client.player.nodes.get(interaction.guild);

    if (!interaction.member.voice.channel) return interaction.reply({ content: "❌  |  You must join vc first!", ephemeral: true });
    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
      return interaction.reply({ content: "❌  |  You must join in same vc to request song!", ephemeral: true })
    }

    if (!queue) return interaction.reply({ content : "❌  |  Can't get player from your guild!", ephemeral : true });

    let bar = queue.node.createProgressBar({ timecodes : true });
    let currentSong = queue.currentTrack;

    let isRepeat = queue.repeatMode;

    let embed = new EmbedBuilder()
      .setTitle("Playback Information")
      .setColor("Blue")
      .setAuthor({ name : interaction.user.tag, iconURL : interaction.user.displayAvatarURL()})
      .setThumbnail(currentSong.thumbnail)
      .setFooter({ text : `Requested by ${currentSong.requestedBy.tag}` })
      .setDescription(`**Currently Playing**\n` + (currentSong ? `**[${currentSong.title}](${currentSong.url})**` : "None"))
      .addFields([
        {
          name : 'Pause',
          value : (queue.node.isPaused() ? "✅" : "❌"),
          inline : true
        },
        {
          name : 'Loop',
          value : `${(isRepeat ? "✅" : "❌")}${(!repeatStatus() ? "" : repeatStatus())}`,
          inline : true
        },
        {
          name : "Source",
          value : currentSong.source,
          inline : true
        },
        {
          name : 'Duration',
          value : bar,
          inline : false
        }
      ]);

    await interaction.reply({ embeds : [embed] });
  }
}