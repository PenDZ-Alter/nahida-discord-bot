module.exports = {
  name : "playerEnd",

  async execute(client, player) {
    if (client.debug === "player" || client.debug === "all") {
      console.log("INFO (Track) :: Track end, going to next track!");
    }
  }
}