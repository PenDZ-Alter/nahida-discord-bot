const { YoutubeiExtractor, createYoutubeiStream } = require("discord-player-youtubei");
const { SpotifyExtractor } = require("@discord-player/extractor");

module.exports = (client) => {
  client.handlePlayerExtractors = async() => {
    await client.player.extractors.loadDefault((ext) => !['YouTubeExtractor', 'SpotifyExtractor'].includes(ext));

    await client.player.extractors.register(YoutubeiExtractor, {
      authentication: {
        access_token: process.env.YT_ACCESS_TOKEN || '',
        refresh_token: process.env.YT_REFRESH_TOKEN || '',
        scope: 'https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube-paid-content',
        token_type: 'Bearer',
        expiry_date: process.env.YT_EXP || ''
      }
    });

    await client.player.extractors.register(SpotifyExtractor, {
      createStream : createYoutubeiStream
    });
  }

  client.handlePlayerExtractors();
}