const { EmbedBuilder } = require("discord.js");
const { getIndex, setIndex, getData, getPrivateData, isPrivate } = require("../../commands/etc/pics");

module.exports = {
  data : { name: "prev-pics" },

  async execute(client, interaction) {
    // if (interaction.user.id !== getID()) return interaction.reply({ content : "❌  |  You're not allowed to use this button!", ephemeral : true });
    let imageData = isPrivate() ? getPrivateData() : getData()[interaction.user.id];
    if (!imageData) return interaction.reply({ content : "❌  |  You're not eligible to use this button!", ephemeral : true });

    let indexInit = getIndex();

    index = indexInit - 1;
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