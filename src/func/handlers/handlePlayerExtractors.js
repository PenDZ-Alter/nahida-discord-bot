const { YoutubeiExtractor, createYoutubeiStream } = require("discord-player-youtubei");
const { SpotifyExtractor } = require("@discord-player/extractor");

module.exports = (client) => {
  client.handlePlayerExtractors = async() => {
    await client.player.extractors.loadDefault((ext) => !['YouTubeExtractor', 'SpotifyExtractor'].includes(ext));
    
    await client.player.extractors.register(YoutubeiExtractor, {
      authentication: process.env.YT_CREDENTIAL_USER,
      signOutOnDeactive: false
    });

    await client.player.extractors.register(SpotifyExtractor, {
      createStream : createYoutubeiStream
    });
  }

  client.handlePlayerExtractors();
}