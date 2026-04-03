const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const cacheFolder = path.join(__dirname, "../../../cache");
const cacheFile = path.join(cacheFolder, "pics.json");

module.exports = {
  data : { name: "prev-pics" },

  async execute(client, interaction) {
    const interactionID = interaction.message.interaction.id;

    let interactionData = {};
    if (fs.existsSync(cacheFile)) {
      interactionData = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    }

    const dataRaw = interactionData[interactionID];
    if (!dataRaw) return interaction.reply({ content: "❌  |  No data found for this interaction.", ephemeral: true })

    let { index, user, data, PID } = dataRaw;

    if (interaction.user.id !== user) return interaction.reply({ content : "❌  |  You're not allowed to use this button!", ephemeral : true });
    index -= 1;
    if (index < 0) index = data.length - 1;

    interactionData[interactionID].index = index;
    fs.writeFileSync(cacheFile, JSON.stringify(interactionData, null, 2));

    if (data[index].tags.includes("video")) {
      await interaction.update({ embeds: [], content: `Result Videos\n${data[index].file_url}\nPage ${index + 1} of ${data.length}${PID != 0 ? ` • PID : ${PID}` : ``}`});
    } else {
      let embed = new EmbedBuilder()
        .setTitle("Result Images")
        .setDescription(data[index].file_url)
        .setImage(data[index].preview_url)
        .setColor("Blue")
        .setFooter({ text : `Page ${index + 1} of ${data.length}${PID != 0 ? ` • PID : ${PID}` : ``}` })
        .setTimestamp(Date.now())
  
      await interaction.update({ embeds: [embed], content: "" });
    }

  }
}