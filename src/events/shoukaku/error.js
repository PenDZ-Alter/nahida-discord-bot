module.exports = {
  name : "error",

  async execute(client, name, error) {
    console.log("INFO :: Shoukaku/Kazagumo has problems!");
    console.log(`NODE :: ${name} is error!`);
    if (client.config.debug === "player" || client.config.debug === "all")
      console.error(`ERR : ${error}`);
  }
}