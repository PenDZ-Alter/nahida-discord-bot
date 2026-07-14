import { ActivityType, Events } from 'discord.js';
import { BotClient, BotEvent } from '../../func/utils/types';

const readyEvent: BotEvent = {
  name : Events.ClientReady,
  once : false,

  async execute(client: BotClient): Promise<void> {
    const activityTypeRaw = client.config.events.ready.activity as string;
    const activity = client.config.events.ready.activityText;
    const status = client.config.events.ready.status;

    client.user?.setStatus(status);

    const typeActivity = ActivityType[activityTypeRaw as keyof typeof ActivityType];
    client.user?.setActivity(activity, { type : typeActivity });
    console.log("BOT :: The bot is ready!");
  }
}

export default readyEvent;