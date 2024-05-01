import { Client } from "../lib";
import { Events } from "../lib/Constant";
import util from "util";

const bot = new Client({
  name: "something",
  prefix: "!",
  readIncommingMsg: true
});

bot.ev.once(Events.ClientReady, (m) => {
  console.log(`ready at ${m.user.id}`);
});

bot.command({
  name: "ping",
  aliases: ["pong"],
  code: async (sock) => {
    sock.sendMessage(sock.id, { text: "pong!" });
  },
});

bot.command({
  name: "say",
  aliases: ["echo"],
  code: async (sock) => {
    sock.reply({ text: sock.args.join(" ") })
  },
});

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

