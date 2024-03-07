const { EmbedBuilder } = require("discord.js");
const { getIndex, setIndex, getData, getID } = require("../../commands/etc/pics");

module.exports = {
  data : { name: "next-pics" },

  async execute(client, interaction) {
    let imageData = getData();
    let indexSetup = getIndex();

    if (interaction.user.id !== getID()) return interaction.reply({ content : "❌  |  You're not allowed to use this button!", ephemeral : true });
    index = indexSetup + 1;
    if (index > imageData.length - 1) index = 0;
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