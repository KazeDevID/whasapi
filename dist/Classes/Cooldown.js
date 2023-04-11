"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cooldown = void 0;
const Functions_1 = require("../Common/Functions");
const events_1 = __importDefault(require("events"));
class Cooldown extends events_1.default {
    constructor(kaze, ms) {
        super();
        this.ms = ms;
        this.cooldown = kaze._self.cooldown;
        this.timeout = 0;
        let q = `cooldown_${kaze._used.command}_${(0, Functions_1.decodeJid)(kaze._msg.key.remoteJid)}_${(0, Functions_1.decodeJid)(kaze._sender.jid)}`;
        const get = this.cooldown.get(q);
        if (get) {
            this.timeout = Number(get) - Date.now();
        }
        else {
            this.cooldown.set(q, Date.now() + ms);
            setTimeout(() => {
                this.cooldown.delete(q);
                this.emit("end");
            }, ms);
        }
    }
    get onCooldown() {
        return this.timeout ? true : false;
    }
    get timeleft() {
        return this.timeout;
    }
}
exports.Cooldown = Cooldown;
