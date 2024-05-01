# whasapi

easy way to create a Whatsapp Bot.

- **✨ Effortless**
- **🧱 Builder**
- **🛒 Built in Collector**
- **⏰ Built in Cooldown**
- **🔑 Built in Command handler**
- **🎉 And more!**

## Table Of Contents
- [Installation](#installation)
- [Example](#example)
  * [Or using the Events](#or-using-the-events)
- [Client Configuration](#client-configuration)
- [Command Options](#command-options)
- [Command Handler](#command-handler)
  * [in your main file](#in-your-main-file)
  * [in your command file](#in-your-command-file)
- [Command Cooldown](#command-cooldown)
- [Builder](#builder)
  * [Button](#button)
  * [Sections](#sections)
  * [Contact](#contact)
  * [Template Buttons](#template-buttons)
- [Collector](#collector)
  * [Message Collector](#message-collector)
  * [Awaited Messages](#awaited-messages)
- [Downloading Media](#downloading-media)
- [Events](#events)
  * [Available Events](#available-events)
- [Sending Message](#sending-message)
- [Formatter](#formatter)
- [Editing Message](#editig-message)
- [Deleting Message](#deleting-message)
- [Poll Message](#poll-message)
- [Get Mentions](#get-mentions)
- [Misc](#misc)

## Installation

```bash
npm install whasapi
# or
yarn add whasapi
# or
pnpm add whasapi
```

## Example

```ts
import { Client } from "whasapi";
import { Events, MessageType } from "whasapi/lib/Constant";

const bot = new Client({
    name: "something",
    prefix: "!",
    printQRInTerminal: true,
    readIncommingMsg: true
});

bot.ev.once(Events.ClientReady, (m) => {
    console.log(`ready at ${m.user.id}`);
});

bot.command('ping', async(sock) => sock.reply({ text: 'pong!' }));
bot.command('hi', async(sock) => sock.reply('hello! you can use string as a first parameter in reply function too!'));

bot.hears('test', async(sock) => sock.reply('test 1 2 3 beep boop...'));
bot.hears(MessageType.stickerMessage, async(sock) => sock.reply('wow, cool sticker'));
bot.hears(['help', 'menu'], async(sock) => sock.reply('hears can be use with array too!'));
bot.hears(/(using\s?)?regex/, async(sock) => sock.reply('or using regex!'));

bot.launch();
```

> ### Or using the Events
>
> ```ts
> import { Client } from "whasapi";
> import { Events } from "whasapi/lib/Constant";
> 
> const bot = new Client({
>     name: "something",
>     prefix: "!", // you can also use array or regex too,
>     printQRInTerminal: true,
>     readIncommingMsg: true
> });
> 
> bot.ev.once(Events.ClientReady, (m) => {
>     console.log(`ready at ${m.user.id}`);
> });
> 
> bot.ev.on(Events.MessagesUpsert, (m, sock) => {
>     if(m.key.fromMe) return;
>     if(m.content === "hello") {
>         sock.reply("hi 👋");
>     }
> })
> 
> bot.launch();
> ```

## Client Configuration

```ts
export interface ClientOptions {
    /* as browser name */ 
    name: string;
    /* the bot prefix */
    prefix: Array<string> | string | RegExp;
    /* should bot mark as read the incomming messages? */
    readIncommingMsg?: boolean;
    /* path to the auth/creds directory */
    authDir?: string;
    /* print the qr in terminal? */
    printQRInTerminal?: boolean;
    /* time taken to generate new qr in ms (default is 60000 ms or 1 minute) */
    qrTimeout?: number;
    /* should the client mark as online on connect? default to be true. */
    markOnlineOnConnect?: boolean;
}
```

## Command Options
```ts
bot.command(opts: CommandOptions | string, code?: (sock: sock) => Promise<any>)
```

```ts
// you can use the new command function code too! 
bot.command('ping', async(sock) => sock.reply('pong!'))
```

```ts
// or you can use the old one!
export interface CommandOptions {
    /* command name */
    name: string;
    /* command aliases */
    aliases?: Array<string>;
    /* command code */
    code: (sock: sock) => Promise<any>;
}
```

```ts
// e.g
bot.command({
  name: 'ping',
  code: async(sock) => sock.reply('pong!');
})
```

## Command Handler

With command handler you dont need all your command is located in one file.

- ### in your main file
  ```ts
  import { CommandHandler } from "whasapi";
  import path from "path";

  /* ... */
  const cmd = new CommandHandler(bot, path.resolve() + '/CommandsPath');
  cmd.load();

  /* ...bot.launch() */
  ```

- ### in your command file
  ```ts
  module.exports = {
      name: "ping",
      code: async (sock) => {
        sock.reply("pong!");
      },
  };
  ```

  You can add a `type` property to define the handler type... For now there are only `command` and `hears` types.
  
  ```ts
  module.exports = {
      name: "hears with command handler",
      type: "hears", // add this
      code: async (sock) => {
        sock.reply("hello world!");
      },
  };
  ```

## Command Cooldown

Cooldown can give a delay on the command. This can be done to prevent users from spamming your bot commands.

```js
import { Cooldown } from "whasapi"; // import Cooldown class

bot.command('ping', async(sock) => {
    const cd = new Cooldown(sock, 8000); // add this
    if(cd.onCooldown) return sock.reply(`slow down... wait ${cd.timeleft}ms`); // if user has cooldown stop the code by return something.

    sock.reply('pong!')
})
```

if you want to trigger some function when the cooldown end, you can use the "end" events in the cooldown:

> ⚠
> Will always be triggered when the cooldown is over (even though he only runs the command once)

```ts
cd.on("end", () => {
  sock.reply({ text: "cd timeout" });
})
```

Cooldown getter:

```ts
/* check if sender is on cooldown */
cd.onCooldown; // boolean

/* check the cooldown time left (in ms) */
cd.timeleft; // number
```

## Builder

> ⚠ The button and section are now deprecated!

- ### Button
  make a button message with Button Builder. 

  ```ts
  import { ButtonBuilder } from "whasapi";

  // you can use more than 1 builder
  const btn = new ButtonBuilder()
      .setId("id1") // button id
      .setDisplayText("button 1") // button text
      .setType(1); // type

  // pass it into buttons array
  sock.sendMessage(sock.id, { text: "buttons", buttons: [btn] });
  ```

- ### Sections
  Sections message is like a list.

  ```ts
  import { SectionBuilder } from "whasapi";

  // you can use more than 1 like buttons
  const a = new SectionBuilder()
      .setTitle("title") // sections title
      .setRows(
        { title: "abc", rowId: 1 },
        { title: "b", rowId: 2, description: "a" }
      ); // make a rows

  sock.sendMessage(sock.id, {
    text: "sections",
    buttonText: "button text", // buttonText is for the display text for the button
    sections: [a], // pass it into sections array
  });
  ```

- ### Contact
  send a contact.

  ```ts
  import { VCardBuilder } from "whasapi";

  const vcard = new VCardBuilder()
      .setFullName("John Doe") // full name
      .setOrg("PT Mencari Cinta Sejati") // organization name
      .setNumber("62xxxxx") // phone number
      .build(); // required build function at end

  sock.reply({ contacts: { displayName: "John D", contacts: [{ vcard }] }});
  ```

- ### Template Buttons
  send a button with "attachment".

  ```ts
  import { TemplateButtonsBuilder } from "whasapi";

  const templateButtons = new TemplateButtonsBuilder()
        .addURL({ displayText: 'whasapi at Github', url: 'https://github.com/KazeDevID/whasapi' })
        .addCall({ displayText: 'call me', phoneNumber: '+62xxxxxx' })
        .addQuickReply({ displayText: 'just a normal button', id: 'btn1' })
        .build(); // required build function at end

    sock.sendMessage(sock.id, { text: "template buttons", templateButtons });
  ```
## Collector

There are several options that can be used in the collector:
```ts
export interface CollectorArgs {
    /* collector timeout in milliseconds */
    time?: number;
    /* how many messages have passed through the filter */
    max?: number;
    /* will be stop if end reason is match with your col.stop reason  */
    endReason?: string[];
    /* limit how many messages must be processed. */
    maxProcessed?: number;
    /* a function as a filter for incoming messages. */
    filter?: () => boolean;
}
```

- ### Message Collector
  ```ts
  let col = sock.MessageCollector({ time: 10000 }); // in milliseconds
  sock.reply({ text: "say something... Timeout: 10s" });

  col.on("collect", (m) => {
      console.log("COLLECTED", m); // m is an Collections
      sock.sendMessage(sock.id, {
          text: `Collected: ${m.content}\nFrom: ${m.sender}`,
      });
  });

  col.on("end", (collector, r) => {
      console.log("ended", r); // r = reason
      sock.sendMessage(sock.id, { text: `Collector ended` });
  });
  ```

- ### Awaited Messages
  ```ts
  sock.awaitMessages({ time: 10000 }).then((m) => sock.reply(`got ${m.length} array length`)).catch(() => sock.reply('end'))
  ```

## Downloading Media

the code below will save the received image to `./saved.jpeg`
```ts
import { MessageType } from "whasapi/lib/Constant";
import fs from "node:fs";

bot.ev.on(Events.MessagesUpsert, async(m, sock) => {
    if(sock.getMessageType() === MessageType.imageMessage) {
        const buffer = await sock.getMediaMessage(sock.msg, 'buffer')
        fs.writeFileSync('./saved.jpeg', buffer);
    }
})
```

## Events

Firstly you must import the Events Constant like this:
```ts
import { Events } from "whasapi/lib/Constant";
```

- ### Available Events
  - **ClientReady** - Emitted when the bot client is ready.
  - **MessagesUpsert** - Received an messages.
  - **QR** - The bot QR is ready to scan. Return the QR Codes.
  - **GroupsJoin** - Emitted when bot joining groups.
  - **UserJoin** - Emitted when someone joins a group where bots are also in that group.
  - **UserLeave** - Same with **UserJoin** but this is when the user leaves the group.
  - **Poll** - Emitted when someone create a poll message.
  - **PollVote** - Emitted when someone votes for one/more options in a poll.
  - **Reactions** - Emitted when someone reacts to a message.


## Sending Message

```ts
/* sending a message */
sock.sendMessage(sock.id, { text: "hello" });

/* quote the message */
sock.reply("hello");
sock.reply({ text: "hello" });

/* sending an image */
sock.sendMessage(sock.id, { image: { url: 'https://example.com/image.jpeg' }, caption: "image caption" });
sock.reply({ image: { url: 'https://example.com/image.jpeg' }, caption: "image caption" });

/* sending an audio */
sock.reply({ audio: { url: './audio.mp3' }, mimetype: 'audio/mp4', ptt: false }); // if "ptt" is true, the audio will be send as voicenote

/* sending an sticker */
sock.reply({ sticker: { url: './tmp/generatedsticker.webp' }});

/* sending an video */
import fs from "node:fs";
sock.reply({ video: fs.readFileSync("./video.mp4"), caption: "video caption", gifPlayback: false });
```

## Formatter
WhatsApp allows you to format text inside your messages. Like bolding your message, etc. This function formats strings into several markdown styles supported by WhatsApp.

> ⚠ Inline code and quote are only supported in IOS and Whatsapp Web. If your user is on another platform it might look different.

You can see the Whatsapp FAQ about formatting messages [here](https://faq.whatsapp.com/539178204879377/?cms_platform=web).

```ts
import { bold, inlineCode, italic, monospace, quote, strikethrough } from "whasapi";

const str = "Hello World";

const boldString = bold(str);
const italicString = italic(str);
const strikethroughString = strikethrough(str);
const quoteString = quote(str);
const inlineCodeString = inlineCode(str);
const monospaceString = monospace(str);
```

## Editing Message
```ts
let res = await sock.reply("old text");
sock.editMessage(res.key, "new text");
```

## Deleting Message
```ts
let res = await sock.reply("testing");
sock.deleteMessage(res.key);
```

## Poll Message
> `singleSelect` means you can only select one of the multiple options in the poll. Default to be false

```ts
sock.sendPoll(sock.id, { name: "ini polling", values: ["abc", "def"], singleSelect: true })
```

## Get Mentions
You can use the function from `sock` to get the jid array mentioned in the message. For example, a message containing `hello @jstn @person` where `@jstn` & `@person` is a mention, then you can get an array containing the jid of the two mentioned users.

```ts
sock.getMentioned() // return array 
```

## Misc

```ts
/* replying message */
sock.reply({ text: "test" });
sock.reply("you can use string as a first parameter too!");

/* same with bot.command but without prefix */
bot.hears('test', async(sock) => sock.reply('test 1 2 3 beep boop...'));

/* will be triggered when someone sends a sticker message */
import { MessageType } from "whasapi/lib/Constant";
bot.hears(MessageType.stickerMessage, async(sock) => sock.reply('wow, cool sticker'));

/* add react */
sock.react(jid: string, emoji: string, key?: object);
sock.react(sock.id, "👀");

/* get the bot ready at timestamp */
bot.readyAt;

/* get the current jid */
sock.id // string

/* get the array of arguments used */
sock.args // Array<string>

/* get sender details */
sock.sender // { jid: string, pushName: string }

/* get the message type */
sock.getMessageType()

/* read the message */
sock.read()

/* simulate typing or recording state */
sock.simulateTyping()
sock.simulateRecording()

/* change the client about/bio */
bot.bio("Hi there!");

/* fetch someone about/bio */
await bot.fetchBio("1234@s.whatsapp.net");

/* get device */
sock.getDevice(id) 
sock.getDevice() // get the user device

/* check whether the chat is a group */
sock.isGroup()

/* accessing @whiskeysockets/baileys objects */
bot.core
sock._client
```