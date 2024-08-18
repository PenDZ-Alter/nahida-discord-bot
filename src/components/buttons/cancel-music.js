const { getIndex } = require("../../commands/music/insert.js");
const { getAddedIndex, getIsPlaylist, getSizePlaylist, getIsInsert } = require("../../commands/music/play.js");

module.exports = {
  data: {
    name : 'cancel-add'
  },

  async execute(client, interaction) {
    const queue = client.player.nodes.get(interaction.guild);

    if (getIsPlaylist()) {
      for (let i = getSizePlaylist(); i >= 0; i--) {
        await queue.node.remove(i);
      }
    } else if (getIsInsert()) {
      await queue.node.remove(getIndex()-1);
    } else if (getIsInsert() && getIsPlaylist()) {
      for (let i = getSizePlaylist() - getIndex(); i >= 0; i--) {
        await queue.node.remove(i);
      }
    } else {
      await queue.node.remove(getAddedIndex()-1);     
    }

    await interaction.update({ content : "✅  |  Cancelled the added song!", ephemeral : true, components : [], embeds : [] });
  }
}