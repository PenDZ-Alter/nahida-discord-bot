const { getAddedIndex } = require("../../commands/music/play.js");

module.exports = {
  data: {
    name : 'cancel-add'
  },

  async execute(client, interaction) {
    const queue = client.player.nodes.get(interaction.guild);

    await queue.node.remove(getAddedIndex()-1);
    await interaction.update({ content : "✅  |  Cancelled the added song!", ephemeral : true, components : [], embeds : [] });
  }
}