module.exports = {
  name : "playerError",

  async execute(client, queue, error) {
    queue.delete();
    console.log('Error founded!');
    console.error(error);
  }
}