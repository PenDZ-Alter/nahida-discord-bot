const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { API } = require("nhentai-api");
const fs = require("fs");
const path = require("path");

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
      return interaction.reply({ content: "❌  |  This command is disabled.", ephemeral: true });
    }

    const memberRoles = interaction.member.roles;
    const roles = client.config.explicit.roles.id;
    const private = interaction.options.getBoolean("private");

    await interaction.deferReply({ ephemeral: private });

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

    const api = new API();

    let access = false, i = 0;
    while (i < roles.length) {
      if (memberRoles.cache.has(roles[i])) {
        access = true;
        break;
      }
      i++;
    }

    if (!access) {
      return interaction.reply({ content: "❌  |  You dont have permissions to run this commands", ephemeral: true });
    }

    userid = interaction.user.id;

    index = 0;

    if (q != null) {
      try {
        bookData = await api.getBook(query)
      } catch {
        return interaction.editReply({ content: "❌  |  Book not found!" });
      }
    } else {
      try {
        await api.search(updateQuery).then(async search => {
          bookData = search.books[0]
        });
      } catch {
        return interaction.editReply({ content: "❌  |  Books not found!" });
      }
    }

    const extractedData = {
      id: bookData.id,
      title: bookData.title,
      pages: bookData.pages.map(page => api.getImageURL(page)), // Extract URLs of pages
      userid: interaction.user.id
    };

    // Ensure the "cache" folder exists, create it if it doesn't
    if (!fs.existsSync(cacheFolder)) {
      fs.mkdirSync(cacheFolder, { recursive: true });
    }

    // Store data in JSON file
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
      .setDescription(`${extractedData.title.english}\n` + extractedData.pages[0])
      .setImage(extractedData.pages[0])
      .setColor("Blue")
      .setFooter({ text: `Page ${index + 1} of ${extractedData.pages.length} • ID : ${extractedData.id}` })
      .setTimestamp(Date.now())

    await interaction.editReply({ embeds: [embed], components: [button] });
  }
}