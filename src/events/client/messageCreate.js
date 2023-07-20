const { Configuration, OpenAIApi } = require("openai");

module.exports = {
  name : 'messageCreate',

  async execute(client, message) {
    const config = new Configuration({
      apiKey : client.config.api_key
    }); 

    const openai = new OpenAIApi(config);

    if (message.author.bot) return;
    if (message.channel.id !== client.config.ids.channel_ai) return;
    if (!message.member.roles.cache.has(client.config.ids.role_ai)) return;
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
    
    const result = await openai.createChatCompletion({
      model : 'gpt-3.5-turbo',
      messages : conversationLog
    });

    // in testing mode
    let messageContent = result.data.choices[0].message
    let trimmedMsg = messageContent.substring(0, 2048);

    message.reply(trimmedMsg);
  }
}
