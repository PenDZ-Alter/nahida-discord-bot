const { YoutubeiExtractor, createYoutubeiStream } = require("discord-player-youtubei");
const { SpotifyExtractor } = require("@discord-player/extractor");

module.exports = (client) => {
  client.handlePlayerExtractors = async() => {
    // Load all Extractors from default extractors
    await client.player.extractors.loadDefault((ext) => !['YouTubeExtractor', 'SpotifyExtractor'].includes(ext));
    
    // Load Another Extractors    
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