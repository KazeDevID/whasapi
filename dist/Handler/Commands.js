"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Functions_1 = require("../Common/Functions");
const Kaze_1 = require("../Classes/Kaze");
module.exports = (self) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let { cmd, prefix, m } = self;
    let msg = m.messages[0];
    let fromMe = msg.key.fromMe;
    if (!m || !msg.message)
        return;
    if (fromMe)
        return;
    if (msg.key && msg.key.remoteJid === "status@broadcast")
        return;
    let dy = (0, Functions_1.getContentFromMsg)(msg);
    let args;
    let command;
    const valArr = Array.from(cmd.values());
    if (prefix[0] == "") {
        const emptyIndex = prefix.indexOf(prefix.filter((x) => x.includes("")).join(""));
        prefix = (0, Functions_1.arrayMove)(prefix, emptyIndex - 1, prefix.length - 1);
    }
    const startsP = prefix.find((p) => dy === null || dy === void 0 ? void 0 : dy.startsWith(p));
    if (!startsP)
        return;
    args = dy === null || dy === void 0 ? void 0 : dy.slice(startsP.length).trim().split(/ +/g);
    command = (_a = args === null || args === void 0 ? void 0 : args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    const val = valArr.find((c) => c.name.toLowerCase() === command.toLowerCase() ||
        (c.aliases && typeof c.aliases === "object"
            ? c.aliases.includes(command.toLowerCase())
            : c.aliases === command.toLowerCase()));
    if (val)
        val.code(new Kaze_1.Kaze({ used: { prefix: startsP, command }, args, self, client: self.whats }));
});
