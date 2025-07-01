const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const { formatDuration, generateProgressBar } = require("../../func/utils/format");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Shown the playing song info."),

  async execute(client, interaction) {
    if (client.config.commands.music.info === 0) {
      return interaction.reply({ content: "❌  |  This command is disabled.", flags: MessageFlags.Ephemeral });
    }

    const player = client.kazagumo.players.get(interaction.guild.id);

    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply({ content : '❌  |  You are not connected to a voice channel!', flags: MessageFlags.Ephemeral});
    
    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
      return interaction.reply({ content: "❌  |  You must join in same vc to request song!", flags: MessageFlags.Ephemeral });
    }

    if (!player) {
      return interaction.reply({ content: "❌  |  There's no song are playing!", flags: MessageFlags.Ephemeral });
    }

    const currentTrack = player.queue.current;
    const currentPosition = player.position;

    const positionFormatted = formatDuration(currentPosition);
    const durationFormatted = formatDuration(currentTrack.length);
    const progressBar = generateProgressBar(currentPosition, currentTrack.length);

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("Playback Information")
      .setFooter({ text: `Requested by ${currentTrack.requester.username}`, iconURL: currentTrack.requester.displayAvatarURL() })
      .setTimestamp(Date.now())
      .setThumbnail(currentTrack.thumbnail)
      .setDescription(
        `**Currently Playing**\n**[${currentTrack.title}](${currentTrack.uri})**`
      )
      .addFields([
        {
          name : "Source",
          value : currentTrack.sourceName,
          inline : true
        },
        {
          name : "Artist/Channel",
          value : currentTrack.author,
          inline : true
        },
        {
          name: "Total Queue",
          value: player.queue.length.toString()
        },
        {
          name : "\n",
          value : "\n"
        },
        {
          name : 'Pause',
          value : (player.paused ? "✅" : "❌"),
          inline : true
        },
        {
          name : 'Loop',
          value : (player.loop === "none" ? "❌" : `✅ ${player.loop}`),
          inline : true
        },
        {
          name : 'Duration',
          value : `\`${positionFormatted}\` ${progressBar} \`${durationFormatted}\``,
          inline : false
        }
      ]);

    await interaction.reply({ embeds: [embed] });
  },
};
