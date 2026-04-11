module.exports = {
  name : "error",

  async execute(client, name, error) {
    console.log("ERR :: Error Founded in Kazagumo!");
    console.log(`ERR :: Kazagumo :: Lavalink ${name}`);
    if (client.debug === "player" || client.debug === "all") {
      console.error(error);
    }
  }
}