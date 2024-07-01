const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const axios = require("axios");

let index, imageData, userid, _pid, _vidsPack;

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
          { name: "General", value: "general" },
          { name: "Questionable", value: "questionable" },
          { name: "Sensitive", value: "sensitive" },
          { name: "Explicit", value: "explicit" }
        )
    )
    .addIntegerOption(
      opt => opt
        .setName("pid")
        .setDescription("Page of data")
        .setRequired(false)
    )
    .addBooleanOption(
      opt => opt
        .setName("private")
        .setDescription("Set into private")
    )
    .addBooleanOption(
      opt => opt
        .setName("pack")
        .setDescription("Packing up the image")
    ),

  async execute(client, interaction) {
    try {
      const tags = interaction.options.getString("tags");
      const cat = interaction.options.getString("category");
      const private = interaction.options.getBoolean("private");
      const pid = !interaction.options.getInteger("pid") ? 0 : interaction.options.getInteger("pid");
      const pack = interaction.options.getBoolean("pack");
      const memberRoles = interaction.member.roles;
      const roles = client.config.explicit.roles.id;

      await interaction.deferReply({ ephemeral: private });

      const tag = tags.replace(/ /g, "_");

      let access = false, i = 0;
      while (i < roles.length) {
        if (memberRoles.cache.has(roles[i])) {
          access = true;
          break;
        }
        i++;
      }

      // return interaction.editReply({ content : "❌  |  This command was disabled!" });

      if (!access) {
        return interaction.editReply({ content: "❌  |  You dont have permissions to run this roles" });
      }

      userid = interaction.user.id;

      const response = await axios.get(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&&api_key=anonymous&user_id=9455&tags=${tag}&pid=${pid}&json=1`);

      if (!response.data.post || !response.data) {
        return interaction.editReply({ content: "❌  |  Failed went fetching data! Try another tags and make sure you dont add some spesial characters except '_'!" });
      }

      const attrib = response.data['@attributes'];

      let imageUrl, data;
      let limit = Number(attrib.limit);
      let offset = Number(attrib.offset);
      let total = Number(attrib.count);
      let count = 0;

      // Global Variables
      _pid = pid;

      if (total - offset < limit) {
        limit = total - offset;
      }

      if (limit === 0) {
        return interaction.editReply({ content: "❌  |  The content has reached the limit!" });
      }

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
          data = response.data.post[j];
          imageUrl = data.file_url;
          break;
        }
      }

      if (pack) {
        imageData = [];
        const prevButton = new ButtonBuilder()
          .setCustomId("prev-pics")
          .setLabel("Prev")
          .setStyle(ButtonStyle.Secondary)

        const nextButton = new ButtonBuilder()
          .setCustomId("next-pics")
          .setLabel("Next")
          .setStyle(ButtonStyle.Primary)

        const row = new ActionRowBuilder().addComponents(prevButton, nextButton);

        let datas;
        index = 0;

        for (let i = 0; i < limit; i++) {
          if (response.data.post[i].rating === cat) {
            datas = response.data.post[i];
            imageData.push(datas);
          }
        }

        let vidsPack = imageData[index].tags.includes("video");

        if (vidsPack) {
          return interaction.editReply({ content: `Result Videos\n${imageData[index].file_url}\nPage ${index + 1} of ${imageData.length}${pid != 0 ? ` • PID : ${pid}` : ``}`, components: [row] });
        }

        let embed = new EmbedBuilder()
          .setTitle("Result Images")
          .setDescription(imageData[index].file_url)
          .setImage(imageData[index].file_url)
          .setColor("Blue")
          .setFooter({ text : `Page ${index + 1} of ${imageData.length}${pid != 0 ? ` • PID : ${pid}` : ``}` })
          .setTimestamp(Date.now())

        await interaction.editReply({ embeds: [embed], components: [row] });
      } else {
        // Video handler
        let vids = data.tags.includes("video");
        if (vids) {
          return interaction.editReply({ content: `Result Videos\n${imageUrl}` });
        }

        // Send the image URL as a message
        let embed = new EmbedBuilder()
          .setTitle("Result Images")
          .setImage(imageUrl)
          .setColor("Blue")
          .setTimestamp(Date.now());

        await interaction.editReply({ embeds: [embed] });
      }
    } catch (err) {
      console.error(err);
    }
  },

  getIndex : () => {
    return index;
  },

  setIndex : (a) => {
    return index = a;
  },

  getID : () => {
    return userid;
  },
  
  getData : () => {
    return imageData;
  },

  getPID : () => {
    return _pid;
  },

  getVidsPack : () => {
    return imageData[index].tags.includes("video");
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

/** 
 * BUGS!!
 * 
 * There's something problem when requesting data and data changed after another user
 * and some user click the button but the same data as the new request before!
 */