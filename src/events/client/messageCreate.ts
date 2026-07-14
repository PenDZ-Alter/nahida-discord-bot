import { Events, Message, TextChannel } from "discord.js";
import { OpenAI } from "openai";
import { BotClient, BotEvent } from "../../func/utils/types"; // Sesuaikan path utils/type lo

// Import tipe data message untuk OpenAI chat completion
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const messageCreateEvent: BotEvent = {
  name: Events.MessageCreate,
  once: false,

  async execute(client: BotClient, message: Message): Promise<void> {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || ""
    });

    if (message.author.bot) return;
    if (message.content.startsWith('!')) return;
    if (!message.member) return;

    const roles: string[] = client.config.ids.ai_config.roles;
    const channels: string[] = client.config.ids.ai_config.channels;
    const getRolesMember = message.member.roles.cache;
    let access = false;
    let getChannel = false;

    for (const role of roles) {
      if (getRolesMember.has(role)) {
        access = true;
        break;
      }
    }

    for (const ch of channels) {
      if (message.channel.id === ch) {
        getChannel = true;
        break;
      }
    }

    if (!access) return;
    if (!getChannel) return;

    // if (!message.channel.isTextBased()) return;

    const channel = message.channel as TextChannel;

    const log: ChatCompletionMessageParam[] = [];
    await channel.sendTyping();

    const prevMsg = await message.channel.messages.fetch({ limit: 10 });
    const prevMsgArray = Array.from(prevMsg.values()).reverse(); 

    prevMsgArray.forEach((msg) => {
      if (msg.content.startsWith('!')) return;
      if (client.user && msg.author.id !== client.user.id && msg.author.bot) return;
      if (msg.author.id !== message.author.id) return;

      log.push({
        role: 'user',
        content: msg.content
      });
    });

    try {
      const result = await openai.chat.completions.create({
        model: 'o1-mini',
        messages: log
      });

      const messageContent = result.choices[0].message.content;
      if (!messageContent) return;

      const chunkSize = 2000;

      for (let i = 0; i < messageContent.length; i += chunkSize) {
        await message.reply(messageContent.substring(i, i + chunkSize));
      }
    } catch (err) {
      console.error("ERR (OpenAI) :: Processing text error.");
      console.error(err);
    }
  }
};

export default messageCreateEvent;