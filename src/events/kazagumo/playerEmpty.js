module.exports = {
  name : "playerEmpty",

  async execute(client, player) {
    if (client.config.debug === "player" || client.config.debug === "all") {
      console.log("INFO (Player) :: Queue is empty, player session end!");
    }
    player.destroy();
  }
}