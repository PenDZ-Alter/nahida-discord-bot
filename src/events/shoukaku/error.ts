import { BotClient, GeneralEvent } from "../../func/utils/types";

const shoukakuErrorEvent: GeneralEvent = {
  name : "error",

  async execute(client: BotClient, name: any, error: any): Promise<void> {
    console.log("INFO :: Shoukaku/Kazagumo has problems!");
    console.log(`NODE :: ${name} is error!`);
    if (client.debug === "player" || client.debug === "all")
      console.error(`ERR : ${error}`);
  }
}

export default shoukakuErrorEvent;