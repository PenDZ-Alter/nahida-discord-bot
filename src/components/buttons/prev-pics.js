const { EmbedBuilder } = require("discord.js");
const { getIndex, setIndex, getData, getID, getPID, getVidsPack } = require("../../commands/etc/pics");

module.exports = {
  data : { name: "prev-pics" },

  async execute(client, interaction) {
    let imageData = getData();
    let indexSetup = getIndex();

    if (interaction.user.id !== getID()) return interaction.reply({ content : "❌  |  You're not allowed to use this button!", ephemeral : true });
    index = indexSetup - 1;
    if (index < 0) index = imageData.length - 1;
    setIndex(index);

    if (getVidsPack()) {
      await interaction.update({ embeds: [], content: `Result Videos\n${imageData[index].file_url}\nPage ${index + 1} of ${imageData.length}${getPID() != 0 ? ` • PID : ${getPID()}` : ``}`});
    } else {
      let embed = new EmbedBuilder()
        .setTitle("Result Images")
        .setDescription(imageData[index].file_url)
        .setImage(imageData[index].file_url)
        .setColor("Blue")
        .setFooter({ text : `Page ${index + 1} of ${imageData.length}${getPID() != 0 ? ` • PID : ${getPID()}` : ``}` })
        .setTimestamp(Date.now())
  
      await interaction.update({ embeds: [embed], content: "" });
    }
  }
}