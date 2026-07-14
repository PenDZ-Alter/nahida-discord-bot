import { Events } from "discord.js";
import { BotClient, BotEvent } from "../../func/utils/types";

const debugEvent: BotEvent = {
  name: Events.Debug,
  once: false,

  async execute(client: BotClient, msg: string): Promise<void> {
    if (client.debug === "client" || client.debug === "all") {
      console.log(`INFO (Client) :: ${msg}`);
    }
  }
};

export default debugEvent;