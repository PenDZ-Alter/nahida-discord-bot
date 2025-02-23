const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const cacheFolder = path.join(__dirname, "../../../cache");
const cacheFile = path.join(cacheFolder, "nh.json");

module.exports = {
  data: { name: "prev-book" },

  async execute(client, interaction) {
    const interactionID = interaction.message.interaction.id; // Get the interaction ID from the message

    // Load data from JSON file
    let interactionData = {};
    if (fs.existsSync(cacheFile)) {
      interactionData = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    }

    const data = interactionData[interactionID];
    if (!data) return interaction.reply({ content: "❌  |  No data found for this interaction.", ephemeral: true });

    let { index, title, pages, userid, id, tags } = data;

    if (interaction.user.id !== userid) return interaction.reply({ content : "❌  |  You're not allowed to use this button!", ephemeral : true });
    index = index - 1;
    if (index < 0) index = pages.length - 1;
    
    interactionData[interactionID].index = index;
    fs.writeFileSync(cacheFile, JSON.stringify(interactionData, null, 2));

    let embed = new EmbedBuilder()
      .setTitle("Book Results")
      .setDescription(`${title.english}\n` + `${tags}\n` + pages[index])
      .setImage(pages[index])
      .setColor("Blue")
      .setFooter({ text: `Page ${index + 1} of ${pages.length} • ID : ${id}` })
      .setTimestamp(Date.now())

    await interaction.update({ embeds: [embed], content: "" });
  }
}