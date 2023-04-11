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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kaze = void 0;
const Functions_1 = require("../Common/Functions");
const MessageCollector_1 = __importDefault(require("./Collector/MessageCollector"));
class Kaze {
    constructor(options = {
        used: {},
        args: [''],
        self: {},
        client: undefined,
    }) {
        this._used = options.used;
        this._args = options.args;
        this._self = options.self;
        this._client = options.client;
        this._msg = this._self.m.messages[0];
        this._sender = {
            jid: (0, Functions_1.getSender)(this._msg, this._client),
            pushName: this._msg.pushName,
        };
        this._config = {
            name: this._self.name,
            prefix: this._self.prefix,
            cmd: this._self.cmd,
        };
    }
    get id() {
        return this._msg.key.remoteJid;
    }
    get args() {
        return this._args;
    }
    get msg() {
        return this._msg;
    }
    get sender() {
        return this._sender;
    }
    sendMessage(jid, content, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            this._client.sendMessage(jid, content, options);
        });
    }
    reply(content, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            this._client.sendMessage(this.id, content, Object.assign({ quoted: this._msg }, options));
        });
    }
    replyWithJid(jid, content, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            this._client.sendMessage(jid, content, Object.assign({ quoted: this._msg }, options));
        });
    }
    react(jid, emoji, key) {
        return __awaiter(this, void 0, void 0, function* () {
            this._client.sendMessage(jid, {
                react: { text: emoji, key: key ? key : this._msg.key },
            });
        });
    }
    MessageCollector(args = {}) {
        return new MessageCollector_1.default({ self: this._self, msg: this._msg }, args);
    }
    awaitMessages(args = {}) {
        return new Promise((resolve, reject) => {
            const col = this.MessageCollector(args);
            col.once("end", (collected, r) => {
                var _a;
                if ((_a = args.endReason) === null || _a === void 0 ? void 0 : _a.includes(r)) {
                    reject(collected);
                }
                else {
                    resolve(collected);
                }
            });
        });
    }
}
exports.Kaze = Kaze;
