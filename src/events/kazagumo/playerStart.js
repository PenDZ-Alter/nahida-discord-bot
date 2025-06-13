module.exports = {
  name : "playerStart",

  async execute(client, player, track) {
    const channel = client.channels.cache.get(player.textId);

    if (channel) channel.send(`🎶 Now playing: **${track.title}**`);
    if (client.config.debug === "player" || client.config.debug === "all") {
      console.log(`INFO (Player) :: ${track.title} is playing`);
      console.dir(track, { depth : 1 });
    }
  }
}