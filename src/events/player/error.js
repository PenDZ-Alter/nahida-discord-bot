module.exports = {
  name : 'error',

  async execute(client, queue, error) {
    queue.delete();
    console.log("BOT :: Error Founded!");
    console.error(error)
  }
}