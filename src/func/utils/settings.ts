import { Client, GatewayIntentBits, Partials, ClientOptions } from "discord.js";
import { Plugins } from "kazagumo";
import kazagumoSpotify from "kazagumo-spotify";
import kazagumoFilter from "kazagumo-filter";

interface KazagumoSettingsOptions {
  defaultSearchEngine: string;
  send: (guildId: string, payload: any) => void;
  plugins: any[];
}

export const clientSettings = (): ClientOptions => {
  return {
    shards: "auto",
    failIfNotExists: false,
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.MessageContent,
    ],
    partials: [
      Partials.Message,
      Partials.Reaction,
      Partials.User,
    ],
    allowedMentions: {
      parse: ["roles", "users"],
      repliedUser: false,
    },
  };
};

export const kazagumoSettings = (client: Client): KazagumoSettingsOptions => {
  return {
    defaultSearchEngine: "youtube",
    send: (guildId: string, payload: any): void => {
      const guild = client.guilds.cache.get(guildId);
      if (guild) guild.shard.send(payload);
    },
    plugins: [
      new Plugins.PlayerMoved(client),
      new (kazagumoFilter as any)(),
      new kazagumoSpotify({
        clientId: process.env.SPOTIFY_CLIENT_ID || "",
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
      }),
    ],
  };
};