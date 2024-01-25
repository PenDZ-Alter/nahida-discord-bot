const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("segs")
    .setDescription("UOOOOOOOOOOGHHHHHHHHH")
    .addStringOption(
      opt => opt
        .setName("tags")
        .setDescription("Tags of segss")
        .setRequired(true)
    )
    .addStringOption(
      opt => opt
        .setName("category")
        .setDescription("Type of image")
        .setRequired(true)
        .addChoices(
          { name : "General", value : "general" },
          { name : "Questionable", value : "questionable" },
          { name : "Explicit", value : "explicit" }
        )
    ),

  async execute(client, interaction) {
    try {
      const tags = interaction.options.getString("tags");
      const cat = interaction.options.getString("category");
      
      const response = await axios.get(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&tags=${tags}&json=1`);

      let imageUrl
      let j = 0;
      while (true) {
        j = Math.floor(Math.random() * 100);

        if (response.data.post[j].rating === cat) {
          imageUrl = response.data.post[j].file_url;
          break;
        }
      }

      // Send the image URL as a message
      let embed = new EmbedBuilder()
        .setTitle("Result Images")
        .setImage(imageUrl)
        .setColor("Blue")
        .setTimestamp(Date.now());

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (err) {
      console.error(err);
    }
  }
}

/**
 * Notes!
 * If you have error when running this, it's because axios can't get ssl certificate
 * To fix it, you need to use VPN!
 */