import { TextChannel } from "discord.js";
import { BotClient, GeneralEvent } from "../../func/utils/types";
import { KazagumoPlayer } from "kazagumo";

const playerStartEvent: GeneralEvent = {
  name : "playerStart",

  async execute(client: BotClient, player: KazagumoPlayer, track: any): Promise<void> {
    const channel = client.channels.cache.get(player.textId!) as TextChannel;

    if (channel) channel.send(`🎶 Now playing: **${track.title}**`);
    if (client.debug === "player" || client.debug === "all") {
      console.log(`INFO (Player) :: ${track.title} is playing`);
      console.dir(track, { depth : 1 });
    }
  }
}

export default playerStartEvent;