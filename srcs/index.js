import { Client, Intents, MessageEmbed } from "discord.js";
import env from "dotenv";

env.config();

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", (message) => {
  if (!message.guild) return;
  if (!message.guild.emojis.cache) return;
  if (message.author.bot) return;
  const emojis = message.content.match(/<:[A-Za-z0-9_~:]+>/g);
  const processed = [];
  const result = [];
  if (!emojis) return;
  emojis.forEach((e) => {
    const arr = e.substring(2, e.length - 1).split(":");
    processed.push({
      guild: arr[1],
      name: arr[0],
    });
  });
  processed.forEach((cemoji) => {
    if (message.guild.emojis.cache.find((e) => e.name == cemoji.name))
      result.push(
        new MessageEmbed()
          .setAuthor({
            name: message.author.username,
            iconURL: message.author.avatarURL(),
          })
          .setImage(
            message.guild.emojis.cache.find((e) => e.name == cemoji.name).url
          )
      );
  });
  if (result.length == 0) return;
  message.delete();
  message.channel.send({ embeds: result });
});

client.login(process.env.BOT_TOKEN);
