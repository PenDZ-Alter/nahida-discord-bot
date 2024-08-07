const { YoutubeiExtractor, createYoutubeiStream } = require("discord-player-youtubei");
const { SpotifyExtractor, AttachmentExtractor, ReverbnationExtractor, AppleMusicExtractor, SoundCloudExtractor, VimeoExtractor } = require("@discord-player/extractor");

module.exports = (client) => {
  client.handlePlayerExtractors = async() => {
    // Load all Extractors from default extractors
    await client.player.extractors.register(AttachmentExtractor);
    await client.player.extractors.register(ReverbnationExtractor);
    await client.player.extractors.register(AppleMusicExtractor);
    await client.player.extractors.register(SoundCloudExtractor);
    await client.player.extractors.register(VimeoExtractor);
    
    // Load Another Extractors    
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