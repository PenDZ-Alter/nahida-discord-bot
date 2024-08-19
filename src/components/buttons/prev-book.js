const { EmbedBuilder } = require("discord.js");
const { API } = require("nhentai-api");
const { getIndex, getData, setIndex, getUserID, getID } = require("../../commands/etc/nh");

module.exports = {
  data: { name: "prev-book" },

  async execute(client, interaction) {
    const api = new API();

    let imageData = getData();
    let i = getIndex();

    if (interaction.user.id !== getUserID()) return interaction.reply({ content : "❌  |  You're not allowed to use this button!", ephemeral : true });
    let index = i - 1;
    if (index < 0) index = imageData.length - 1;
    setIndex(index);

    let embed = new EmbedBuilder()
      .setTitle("Book Results")
      .setDescription(api.getImageURL(imageData[index]))
      .setImage(api.getImageURL(imageData[index]))
      .setColor("Blue")
      .setFooter({ text: `Page ${index + 1} of ${imageData.length} • ID : ${getID()}` })
      .setTimestamp(Date.now())

    await interaction.update({ embeds: [embed], content: "" });
  }
}