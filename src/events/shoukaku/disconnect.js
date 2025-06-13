module.exports = {
  name: "disconnect",

  async execute(client, name, count) {
    const players = [...client.kazagumo.shoukaku.players.values()].filter(p => p.node.name === name);
    players.map(player => {
      kazagumo.destroyPlayer(player.guildId);
      player.destroy();
    });
    console.warn(`NODE :: ${name} Disconnected!`);
  }
}