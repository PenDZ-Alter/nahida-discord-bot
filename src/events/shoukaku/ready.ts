import { BotClient, GeneralEvent } from "../../func/utils/types";

const shoukakuReadyEvent: GeneralEvent = {
  name : "ready",

  async execute(client: BotClient, name: any): Promise<void> {
    console.log(`NODE :: ${name} is ready!`);
  }
}

export default shoukakuReadyEvent;