"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandler = void 0;
const Functions_1 = require("../Common/Functions");
class CommandHandler {
    constructor(bot, path) {
        this._bot = bot;
        this._path = path;
    }
    load() {
        (0, Functions_1.walk)(this._path, (x) => {
            let cmdObj = require(x);
            this._bot.cmd.set(cmdObj.name, cmdObj);
            console.log(`[whasapi CommandHanlder] Loaded - ${cmdObj.name}`);
        });
    }
}
exports.CommandHandler = CommandHandler;
