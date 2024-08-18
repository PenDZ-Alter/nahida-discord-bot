const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data : new SlashCommandBuilder()
    .setName("skipto")
    .setDescription("Skip to the preffered index")
    .addIntegerOption(opt => opt
        .setName("index")
        .setDescription("Number of index, you can see in queue command!")
        .setRequired(true)
      ),

  async execute(client, interaction) {
    if (client.config.commands.music.skipto === 0) {
      return interaction.reply({ content: "❌  |  This command is disabled.", ephemeral: true });
    }

    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply({ content : '❌  |  You are not connected to a voice channel!', ephemeral : true});
    const queue = client.player.nodes.get(interaction.guild);
    const index = Number(interaction.options.getInteger("index"));

    if (!interaction.member.voice.channel) return interaction.reply({ content: "❌  |  You must join vc first!", ephemeral: true });
    if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
      return interaction.reply({ content: "❌  |  You must join in same vc to request song!", ephemeral: true })
    }

    if (!queue || !queue.node.isPlaying()) return interaction.reply({ content : "❌  |  You're not playing music rn!", ephemeral : true });

    const nextSong = queue.tracks.toArray().slice(index-1, index).map((song) => { return `${song.title}` });

    if (index > queue.tracks.length)
      return interaction.reply({ content : "❌  |  Invalid Index!", ephemeral : true });

    await queue.node.skipTo(index-1);

    let embed = new EmbedBuilder()
      .setTitle("Playback Information")
      .setColor("Blue")
      .setDescription(`✅ Skipped to **${nextSong}**!`)

    await interaction.reply({ embeds : [embed], ephemeral : false });
  }
}