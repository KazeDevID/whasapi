"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Client = void 0;
const baileys_1 = __importStar(require("@adiwajshing/baileys"));
const pino_1 = __importDefault(require("pino"));
const undici_1 = require("undici");
const events_1 = __importDefault(require("events"));
const Events_1 = require("../Constant/Events");
const collection_1 = require("@discordjs/collection");
class Client {
    constructor(opts) {
        var _a, _b, _c;
        this.name = opts.name;
        this.prefix = opts.prefix;
        this.readIncommingMsg = (_a = opts.readIncommingMsg) !== null && _a !== void 0 ? _a : false;
        this.authDir = (_b = opts.authDir) !== null && _b !== void 0 ? _b : './state';
        this.printQRInTerminal = (_c = opts.printQRInTerminal) !== null && _c !== void 0 ? _c : true;
        this.ev = new events_1.default();
        this.cmd = new collection_1.Collection();
        this.cooldown = new collection_1.Collection();
        if (typeof this.prefix === "string")
            this.prefix = this.prefix.split('');
    }
    WAVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            let version = [2, 2311, 5];
            try {
                let { body } = yield (0, undici_1.request)("https://web.whatsapp.com/check-update?version=1&platform=web");
                const data = yield body.json();
                version = data.currentVersion.split(".").map(Number);
            }
            catch (_a) {
                version = version;
            }
            return version;
        });
    }
    onConnectionUpdate() {
        this.whats.ev.on('connection.update', (update) => {
            var _a, _b, _c;
            const { connection, lastDisconnect } = update;
            if (update.qr)
                this.ev.emit(Events_1.Events.QR, update.qr);
            if (connection === 'close') {
                const shouldReconnect = ((_b = (_a = lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !== baileys_1.DisconnectReason.loggedOut;
                console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
                if (shouldReconnect)
                    this.launch();
            }
            else if (connection === 'open') {
                this.readyAt = Date.now();
                (_c = this.ev) === null || _c === void 0 ? void 0 : _c.emit(Events_1.Events.ClientReady, this.whats);
            }
        });
    }
    onCredsUpdate() {
        this.whats.ev.on("creds.update", this.saveCreds);
    }
    read(m) {
        this.whats.readMessages([
            {
                remoteJid: m.messages[0].key.remoteJid,
                id: m.messages[0].key.id,
                participant: m.messages[0].key.participant
            },
        ]);
    }
    onMessage() {
        this.whats.ev.on("messages.upsert", (m) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            (_a = this.ev) === null || _a === void 0 ? void 0 : _a.emit(Events_1.Events.MessagesUpsert, m);
            let self = Object.assign(Object.assign({}, this), { getContentType: baileys_1.getContentType, m });
            if (this.readIncommingMsg)
                this.read(m);
            yield require('../Handler/Commands')(self);
        }));
    }
    onGroupParticipantsUpdate() {
        this.whats.ev.on("group-participants.update", (m) => __awaiter(this, void 0, void 0, function* () {
            if (m.action === "add")
                return this.ev.emit(Events_1.Events.UserJoin, m);
            if (m.action === "remove")
                return this.ev.emit(Events_1.Events.UserLeave, m);
        }));
    }
    onGroupsJoin() {
        this.whats.ev.on('groups.upsert', (m) => {
            this.ev.emit(Events_1.Events.GroupsJoin, m);
        });
    }
    command(opts) {
        var _a;
        (_a = this.cmd) === null || _a === void 0 ? void 0 : _a.set(opts.name, opts);
    }
    launch() {
        return __awaiter(this, void 0, void 0, function* () {
            const { state, saveCreds } = yield (0, baileys_1.useMultiFileAuthState)(this.authDir);
            this.state = state;
            this.saveCreds = saveCreds;
            const version = yield this.WAVersion();
            this.whats = (0, baileys_1.default)({
                logger: (0, pino_1.default)({ level: "fatal" }),
                printQRInTerminal: this.printQRInTerminal,
                auth: this.state,
                browser: [this.name, "Chrome", "1.0.0"],
                version,
            });
            this.onConnectionUpdate();
            this.onCredsUpdate();
            this.onMessage();
            this.onGroupParticipantsUpdate();
            this.onGroupsJoin();
        });
    }
}
exports.Client = Client;
