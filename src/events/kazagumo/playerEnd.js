module.exports = {
  name : "playerEnd",

  async execute(client, player) {
    if (client.config.debug === "player" || client.config.debug === "all") {
      console.log("INFO (Track) :: Track end, going to next track!");
    }
  }
}