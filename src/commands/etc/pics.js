const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, AttachmentBuilder } = require('discord.js');
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { downloadGambar } = require('../../func/utils/format');

const cacheFolder = path.join(__dirname, "../../../cache");
const cacheFile = path.join(cacheFolder, "pics.json");

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
        .setRequired(false)
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
    if (client.config.commands.etc.pics === 0) {
      return interaction.reply({ content: "❌  |  This command is disabled.", flags: MessageFlags.Ephemeral });
    }

    try {
      const tags = interaction.options.getString("tags");
      const cat = interaction.options.getString("category") || "all";
      const private = interaction.options.getBoolean("private");
      const pid = interaction.options.getInteger("pid") || 0;
      const pack = interaction.options.getBoolean("pack");
      const memberRoles = interaction.member.roles;
      const roles = client.config.ids.explicit.roles;
      const api_key = process.env.GELBOORU_API_KEY;
      const user_id = process.env.GELBOORU_USER_ID;

      await interaction.deferReply({ flags: private ? MessageFlags.Ephemeral : undefined });

      const tag = tags.replace(/ /g, "_");

      const access = roles.some(role => memberRoles.cache.has(role));

      if (!access) {
        return interaction.editReply({ content: "❌  |  You dont have permissions to run this roles", flags: MessageFlags.Ephemeral });
      }

      const response = await axios.get(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&api_key=${api_key}&user_id=${user_id}&tags=${tag}&pid=${pid}&json=1`).catch(error => {
        if (error.response) {
          console.error(`ERROR :: Error response from gelbooru API: ${error.response.status} - ${error.response.statusText}`);
          console.error(`ERROR :: Response headers: ${JSON.stringify(error.response.headers)}`);
        } else if (error.request) {
          console.error(`ERROR :: No response received from gelbooru API: ${error.request}`);
        } else {
          console.error(`ERROR :: Error setting up request to gelbooru API: ${error.message}`);
        }

        console.log(`ERROR :: Request config: ${JSON.stringify(error.config)}`);

        return interaction.editReply({ content: "❌  |  Failed when fetching data! something is really wrong with the API 😔!" });
      });

      if (client.debug == "client" || client.debug == "all") {
        console.log(`INFO :: Response status : ${response.status}`);
      }

      if (!response.data.post || !response.data) {
        if (client.debug == "player" || client.debug == "all") {
          console.error("BOT :: Can't fetching data from gelbooru!");
          console.log(response.data);
        }
        return interaction.editReply({ content: "❌  |  Failed when fetching data! Try another tags and make sure you dont add some spesial characters except '+'!" });
      }


      const attrib = response.data['@attributes'];

      let imageUrl, data;
      let limit = Number(attrib.limit);
      let offset = Number(attrib.offset);
      let total = Number(attrib.count);
      let count = 0;

      if (total - offset < limit) {
        limit = total - offset;
      }

      if (limit === 0) {
        return interaction.editReply({ content: "❌  |  The content has reached the limit!" });
      }

      if (pack) {
        let imageData = [];
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
        let index = 0;

        for (let i = 0; i < limit; i++) {
          if (response.data.post[i].rating === cat) {
            datas = response.data.post[i];
            imageData.push(datas);
          } else if (cat === "all") {
            datas = response.data.post[i];
            imageData.push(datas);
          }
        }

        // console.log(`DEBUG :: Check State : 'image data length' = ${imageData.length} = 'limit'? ${limit} `)

        let _vidsPack;
        if (index >= 0 && index < imageData.length) {
          _vidsPack = imageData[index].tags?.includes("video") || false;
        } else {
          // console.error("ERR :: Index Out of Bound");
          return interaction.editReply({ content: "❌  |  There's no category for this search! Try another category, or don't specify to check if the data is actually shown up!" });
        }
        // let _vidsPack = imageData[index].tags.includes("video");

        const extractedData = {
          user: interaction.user.id,
          data: imageData,
          PID: pid,
          timestamp: Date.now()
        }

        if (!fs.existsSync(cacheFolder)) {
          fs.mkdirSync(cacheFolder, { recursive: true });
        }

        let interactionData = {};
        if (fs.existsSync(cacheFile)) {
          interactionData = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
        }
        interactionData[interaction.id] = { index: 0, ...extractedData };
        fs.writeFileSync(cacheFile, JSON.stringify(interactionData, null, 2));

        let msg = "";
        if (_vidsPack) {
          msg = interaction.editReply({ content: `Result Videos\n${imageData[index].file_url}\nPage ${index + 1} of ${imageData.length}${pid != 0 ? ` • PID : ${pid}` : ``}`, components: [row] });
        }

        // console.log(`Image URL : ${imageData[index].file_url}`);

        let embed = new EmbedBuilder()
          .setTitle("Result Images")
          .setDescription(imageData[index].file_url)
          .setImage(imageData[index].preview_url)
          .setColor("Blue")
          .setFooter({ text: `Page ${index + 1} of ${imageData.length}${pid != 0 ? ` • PID : ${pid}` : ``}` })
          .setTimestamp(Date.now())

        await interaction.editReply({ embeds: [embed], content: msg, components: [row] });
      } else {
        for (let i = 0; i < limit; i++) {
          if (response.data.post[i].rating === cat && cat !== "all") count++;
          else {
            count = limit;
            break;
          }
        }

        if (count === 0) {
          return interaction.editReply({ content: "❌  |  Cant find the image, try another way!" });
        }

        let j = 0;
        while (true) {
          j = Math.floor(Math.random() * count);

          if (response.data.post[j].rating === cat && cat !== "all") {
            data = response.data.post[j];
            imageUrl = data.file_url;
            break;
          } else {
            data = response.data.post[j];
            imageUrl = data.file_url;
            break
          }
        }

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
  }
}