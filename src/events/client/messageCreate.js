const { OpenAI } = require("openai");

module.exports = {
  name : 'messageCreate',

  async execute(client, message) {
    const openai = new OpenAI({
      apiKey : client.config.api_key
    }); 

    if (message.author.bot) return;
    if (message.channel.id !== client.config.ids.ai_config.channel) return;
    if (!message.member.roles.cache.has(client.config.ids.ai_config.role)) return;
    if (message.content.startsWith('!')) return;

    let conversationLog = [{ role : 'system', content : "You're friendly chat bot!" }];

    await message.channel.sendTyping();

    let prevMsg = await message.channel.messages.fetch({ limit : 10 });
    prevMsg.reverse();

    prevMsg.forEach((msg) => {
      if (message.content.startsWith('!')) return;
      if (msg.author.id !== client.user.id && message.author.bot) return;
      if (msg.author.id !== message.author.id) return;

      conversationLog.push({
        role : 'user',
        content : msg.content
      });
    });
    
    const result = await openai.chat.completions.create({
      model : 'gpt-4-0613',
      messages : conversationLog
    });

    // in testing mode
    let messageContent = result.choices[0].message.content;
    let trimmedMsg = messageContent.substring(0, 2048);

    message.reply(trimmedMsg);
  }
}
