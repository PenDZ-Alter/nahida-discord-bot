module.exports = {
  name : 'playerStart',

  async execute(client, queue, track) {
    queue.metadata.channel.send(`🎵  |  Now playing **${track.title}**!`);
  }
}