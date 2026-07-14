import { GeneralEvent } from "../../func/utils/types";

const uncaughtExceptionEvent: GeneralEvent = {
  name: "uncaughtException",

  async execute(err: any): Promise<void> {
    // Reject the promise with the error
    console.log("BOT :: Error Founded!");
    console.log("INFO :: Uncaught Exception error")
    console.error(err);
  }
}

export default uncaughtExceptionEvent;