const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { API } = require("nhentai-api");

let index, imageData, userid;

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
      return interaction.reply({ content: "❌  |  You dont have permissions to run this roles", ephemeral: true });
    }

    userid = interaction.user.id;

    index = 0;

    await api.getBook(query).then((book) => {
      imageData = book.pages;
    }).catch(() => {
      return interaction.editReply({ content: "❌  |  Book not found!" });
    });

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
      .setDescription(api.getImageURL(imageData[0]))
      .setImage(api.getImageURL(imageData[0]))
      .setColor("Blue")
      .setFooter({ text: `Page ${index + 1} of ${imageData.length}` })
      .setTimestamp(Date.now())

    await interaction.editReply({ embeds: [embed], components: [button] });
  },

  getData: () => {
    return imageData;
  },

  getUserID: () => {
    return userid;
  },

  getIndex: () => {
    return index;
  },

  setIndex: (i) => {
    index = i;
  }
}