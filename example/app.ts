import { ButtonBuilder, Client, Cooldown, SectionsBuilder, TemplateButtonsBuilder } from "../lib";
import { Events, MessageType } from "../lib/Constant";
import fs from "node:fs";
import util from "util";

const bot = new Client({
    name: "something",
    prefix: "!",
    readIncommingMsg: true,
});

bot.ev.once(Events.ClientReady, (m) => {
    console.log(`ready at ${m.user.id}`);
});

bot.ev.on(Events.Poll, (m) => {
  console.log(`POLL`, m);
});

bot.ev.on(Events.PollVote, (m) => {
  console.log(`POLL VOTE`, m);
});

bot.ev.on(Events.Reactions, (m) => {
  console.log(`REACT`, m);
});

bot.command('ping', async(sock) => sock.reply({ text: 'pong!' }));
bot.command('hi', async(sock) => sock.reply('hello! you can use string as a first parameter in reply function too!'));

bot.hears('test', async(sock) => sock.reply('test 1 2 3 beep boop...'));

bot.hears(MessageType.stickerMessage, async(sock) => sock.reply('wow, cool sticker'));
bot.hears(['help', 'menu'], async(sock) => sock.reply('hears can be use with array too!'));
bot.hears(/(using\s?)?regex/, async(sock) => sock.reply('or using regex!'));

bot.command('simulatetyping', async(sock) => {
    sock.simulateTyping();
    sock.reply("aaa")
});

bot.command('collector', async(sock) => {
  let col = sock.MessageCollector({ time: 10000 }); // in milliseconds
  sock.reply({ text: "say something... Timeout: 10s" });

  col.on("collect", (m) => {
      console.log("COLLECTED", m); // m is an Collections
      sock.sendMessage(sock.id!, {
          text: `Collected: ${m.content}\nFrom: ${m.sender}`,
      });
  });

  col.on("end", (collector, r) => {
      console.log("ended", r); // r = reason
      sock.sendMessage(sock.id!, { text: `Collector ended` });
  });
})

bot.command('cooldown', async(sock) => {
  const cd = new Cooldown(sock, 8000); // add this
  if(cd.onCooldown) return sock.reply(`slow down... wait ${cd.timeleft}ms`); // if user has cooldown stop the code by return something.

  sock.reply('pong!')
})

bot.command({
    name: "e",
    code: async (sock) => {
      try {
        var evaled = await eval(sock.args.join(" "));
        return sock.reply({
          text: util.inspect(evaled, { depth: 0 }),
        });
      } catch (err) {
        return sock.reply({ text: `${err}!` });
      }
    },
  });

bot.launch();

