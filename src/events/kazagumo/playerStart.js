module.exports = {
  name : "playerStart",

  async execute(client, player, track) {
    const channel = client.channels.cache.get(player.textId);
    if (channel) channel.send(`🎶 Now playing: **${track.title}**`);
  }
}