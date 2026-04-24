const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags } = require("discord.js");
// const { API } = require('nhentai-api');
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const cacheFolder = path.join(__dirname, "../../../cache");
const cacheFile = path.join(cacheFolder, "nh.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nh")
    .setDescription("Show the book of nhen*")
    .addStringOption(opt => opt
      .setName("query")
      .setDescription("Number codes or title of book")
      .setRequired(true)
    )
    .addBooleanOption(opt => opt
      .setName("private")
      .setDescription("Set this command into private!")
      .setRequired(false)
    ),

  async execute(client, interaction) {
    if (client.config.commands.etc.nh === 0) {
      return interaction.reply({ content: "❌  |  This command is disabled.", flags: MessageFlags.Ephemeral });
    }

    if (client.debug == 'client' || client.debug == 'all') console.debug('BOT :: Commands : Executing /nh ...');

    const memberRoles = interaction.member.roles;
    const roles = client.config.ids.explicit.roles;
    const private = interaction.options.getBoolean("private");

    await interaction.deferReply({ flags: private ? MessageFlags.Ephemeral : undefined });

    const query = interaction.options.getString("query");

    const interactionID = interaction.id;
    
    let bookData;
    let q, updateQuery;
    // Check if query is fully numeric
    if (/^\d+$/.test(query)) {
      // Convert to number
      q = Number(query);
    } else {
      updateQuery = query.replace(/ /g, "_");
      // updateQuery = query;
    }
    
    let response;
    try {
      response = await axios.get(`https://nhentai.net/api/v2/galleries/${q}`);
      if (client.debug = 'all' || client.debug == 'client') console.log(response);
    } catch (err) {
      console.log("ERR :: Error Founded!");
      if (client.debug == 'all' || client.debug == 'client') console.error(err);
    }

    let access = false, i = 0;
    while (i < roles.length) {
      if (memberRoles.cache.has(roles[i])) {
        access = true;
        break;
      }
      i++;
    }

    if (!access) {
      return interaction.reply({ content: "❌  |  You dont have permissions to run this commands", flags: MessageFlags.Ephemeral });
    }

    userid = interaction.user.id;

    let index = 0;

    // if (q != null) {
    //   try {
    //     bookData = await api.getBook(query);
    //   } catch (err) {
    //     if (client.debug == 'all' || client.debug == 'client') {
    //       console.log("ERR :: /nh commands didn't work properly!!");
    //       console.error(err);
    //     }
    //     return interaction.editReply({ content: "❌  |  Book not found!" });
    //   }
    // } else {
    //   try {
    //     await api.search(updateQuery).then(async search => {
    //       bookData = search.books[0];
    //     });
    //   } catch (err) {
    //     if (client.debug == 'all' || client.debug == 'client') {
    //       console.log("ERR :: /nh commands didn't work properly!!");
    //       console.error(err);
    //     }
    //     return interaction.editReply({ content: "❌  |  Something went wrong! Please wait 'till developer fix this :)" });
    //   }
    // }

    try {
      bookData = response.data;
    } catch (err) {
      if (client.debug == 'all' || client.debug == 'client') {
        console.log("ERR :: /nh commands didn't work properly!!");
        console.error(err);
      }
      return interaction.editReply({ content: "❌  |  Book not found!" });
    }

    const extractedData = {
      id: bookData.id,
      title: bookData.title,
      tags: bookData.tags.map(tag => tag.name).join(', '),
      pages: bookData.pages,
      userid: interaction.user.id,
      timestamp: Date.now()
    };

    if (!fs.existsSync(cacheFolder)) {
      fs.mkdirSync(cacheFolder, { recursive: true });
    }

    let interactionData = {};
    if (fs.existsSync(cacheFile)) {
      interactionData = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    }
    interactionData[interactionID] = { index: 0, ...extractedData };
    fs.writeFileSync(cacheFile, JSON.stringify(interactionData, null, 2));

    const nextButton = new ButtonBuilder()
      .setCustomId("next-book")
      .setLabel("Next")
      .setStyle(ButtonStyle.Primary);

    const prevButton = new ButtonBuilder()
      .setCustomId("prev-book")
      .setLabel("Prev")
      .setStyle(ButtonStyle.Secondary);

    const button = new ActionRowBuilder().addComponents(prevButton, nextButton);

    let embed = new EmbedBuilder()
      .setTitle("Book Results")
      .setDescription(`${extractedData.title.english}\n` + `Tags: ${extractedData.tags}\n`)
      .setImage(`https://i1.nhentai.net/${extractedData.pages[index].path}`)
      .setColor("Blue")
      .setFooter({ text: `Page ${index + 1} of ${extractedData.pages.length} • ID : ${extractedData.id}` })
      .setTimestamp(Date.now())

    await interaction.editReply({ embeds: [embed], components: [button] });
  }
}