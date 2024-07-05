const { Events } = require("discord.js");
const { OpenAI } = require("openai");

module.exports = {
  name : Events.MessageCreate,

  async execute(client, message) {
    const openai = new OpenAI({
      apiKey : process.env.OPENAI_API_KEY
    }); 

    /* Error Handling */
    if (message.author.bot) return;
    if (message.content.startsWith('!')) return;

    // Single ids
    // if (!message.member.roles.cache.has(client.config.ids.ai_config.roles)) return;
    // if (message.channel.id !== client.config.ids.ai_config.channel) return;

    // Getting access from array -> Multiple ids
    const roles = client.config.ids.ai_config.roles;
    const channels = client.config.ids.ai_config.channel;
    const getRolesMember = message.member.roles.cache;
    let access = false, getChannel = false;

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
    
    let log = [];
    await message.channel.sendTyping();

    let prevMsg = await message.channel.messages.fetch({ limit : 10 });
    prevMsg.reverse();

    prevMsg.forEach((msg) => {
      if (message.content.startsWith('!')) return;
      if (msg.author.id !== client.user.id && message.author.bot) return;
      if (msg.author.id !== message.author.id) return;

      log.push({
        role : 'user',
        content : msg.content
      });
    });
    
    const result = await openai.chat.completions.create({
      model : 'gpt-4o-2024-05-13',
      messages : log
    });

    // in testing mode
    let messageContent = result.choices[0].message.content;
    let chunkSize = 2000;

    for (let i = 0; i < messageContent.length; i += chunkSize) {
      message.reply(messageContent.substring(i, i + chunkSize));
    }
  }
}
