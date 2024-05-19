const { Events } = require("discord.js");
const { OpenAI } = require("openai");

module.exports = {
  name : Events.MessageCreate,

  async execute(client, message) {
    const openai = new OpenAI({
      apiKey : client.config.api_key
    }); 

    /* Error Handling */
    if (message.author.bot) return;
    if (message.content.startsWith('!')) return;

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

    // Single ids
    // if (!message.member.roles.cache.has(client.config.ids.ai_config.roles)) return;
    // if (message.channel.id !== client.config.ids.ai_config.channel) return;
    
    // Multiple ids
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
      // model : 'gpt-4',
      messages : log
    });

    // in testing mode
    let messageContent = result.choices[0].message.content;
    let content = messageContent.substring(0, 2000);
    let secContent = messageContent.substring(2000, 4000);
    let thrdContent = messageContent.substring(4000, 6000);
    let forthContent = messageContent.substring(6000, 8000);

    message.reply(content);
    if (secContent) {
      message.reply(secContent);
    }
    if (thrdContent) {
      message.reply(thrdContent);
    }
    if (forthContent) {
      message.reply(forthContent);
    }
  }
}
