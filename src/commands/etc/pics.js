const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pics")
    .setDescription("Getting pictures from gelbooru")
    .addStringOption(
      opt => opt
        .setName("tags")
        .setDescription("Tags of pics")
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
          { name : "Sensitive", value : "sensitive" },
          { name : "Explicit", value : "explicit" }
        )
    )
    .addIntegerOption(
      opt => opt
        .setName("pid")
        .setDescription("Page of data")
        .setRequired(false)
    ),

  async execute(client, interaction) {
    try {
      const tags = interaction.options.getString("tags");
      const cat = interaction.options.getString("category");
      const pid = !interaction.options.getInteger("pid") ? 0 : interaction.options.getInteger("pid");
      const memberRoles = interaction.member.roles;
      const roles = client.config.explicit.roles.id;

      await interaction.deferReply({ ephemeral: true });

      const tag = tags.replace(/ /g, "_");

      let access = false, i = 0;
      while (i < roles.length) {
        if (memberRoles.cache.has(roles[i])) {
          access = true;
          break;
        }
        i++;
      }

      if (!access) { 
        return interaction.editReply({ content: "❌  |  You dont have permissions to run this roles" });
      }
      
      const response = await axios.get(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&tags=${tag}&pid=${pid}&json=1`);

      if (!response.data.post || !response.data) {
        return interaction.editReply({ content: "❌  |  Failed went fetching data! Try another tags and make sure you dont add some spesial characters except '_'!" });
      }

      let imageUrl;
      let limit = Number(response.data['@attributes'].limit);
      let count = 0;

      for (let i = 0; i < limit; i++) {
        if (response.data.post[i].rating === cat) count++;
      }

      if (count === 0) {
        return interaction.editReply({ content: "❌  |  Cant find the image, try another way!" });
      }

      let j = 0;
      while (true) {
        j = Math.floor(Math.random() * limit);

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

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error(err);
    }
  }
}

/**
 * Notes!
 * If you have error when running this, it's because axios can't get ssl certificate
 * To fix it, you need to use VPN or DNS!
 * 
 * max limit in gelbooru is 100
 * pid is set the offset of page count per limit
 */