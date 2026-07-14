import { BotClient, GeneralEvent } from "../../func/utils/types";
import { KazagumoError } from "kazagumo";

const kazagumoErrorEvent: GeneralEvent = {
  name : "error",

  async execute(client: BotClient, name: any, error: KazagumoError): Promise<void> {
    console.log("ERR :: Error Founded in Kazagumo!");
    console.log(`ERR :: Kazagumo :: Lavalink ${name}`);
    if (client.debug === "player" || client.debug === "all") {
      console.error(error);
    }
  }
}

export default kazagumoErrorEvent;