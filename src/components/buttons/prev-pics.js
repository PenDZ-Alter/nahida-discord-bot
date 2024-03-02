const { EmbedBuilder } = require("discord.js");
const { getIndex, setIndex, getData } = require("../../commands/etc/pics");

module.exports = {
  data : { name: "prev-pics" },

  async execute(client, interaction) {
    let imageData = getData();
    let indexSetup = getIndex();
    index = indexSetup - 1;
    if (index < 0) index = imageData.length - 1;
    setIndex(index);

    let embed = new EmbedBuilder()
      .setTitle("Result Images")
      .setDescription(imageData[index].file_url)
      .setImage(imageData[index].file_url)
      .setColor("Blue")
      .setFooter({ text : `Page ${index + 1} of ${imageData.length}` })
      .setTimestamp(Date.now())

    await interaction.update({ embeds: [embed] });
  }
}