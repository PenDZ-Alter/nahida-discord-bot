module.exports = {
  name : "playerEmpty",

  async execute(client, player) {
    if (client.debug === "player" || client.debug === "all") {
      console.log("INFO (Player) :: Queue is empty, player session end!");
    }
    player.destroy();
  }
}