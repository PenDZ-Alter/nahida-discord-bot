module.exports = {
  name : "error",

  async execute(client, error) {
    console.log("INFO :: Shoukaku/Kazagumo has problems!");
    console.error(`ERR : ${error}`);
  }
}