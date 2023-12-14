const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("segs")
    .setDescription("UOOOOOOOOOOGHHHHHHHHH")
    .addStringOption(
      opt => opt
        .setName("tag")
        .setDescription("Tags of segss")
        .setRequired(true)
    ),

  async execute(client, interaction) {
    try {
      const tags = interaction.options.getString("tag");
      const response = await axios.get(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&tags=${tags}&limit=1&json=1`);

      if (response.data.length > 0) {
        // Get the URL of the first image
        const imageUrl = response.data[0].file_url;

        // Send the image URL as a message
        let embed = new EmbedBuilder()
          .setTitle("Result Images")
          .setDescription(imageUrl)
          .setColor("Blue")
          .setTimestamp(Date.now());

        interaction.reply({ embeds: [embed], ephemeral: true });
      } else {
        // If no images were found, send an error message
        interaction.reply({ content: 'No images found with the given tags.', ephemeral: true });
      }
    } catch (err) {
      console.error(err);
    }
  }
}