"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeJid = exports.walk = exports.getSender = exports.getContentFromMsg = exports.arrayMove = void 0;
const baileys_1 = require("@adiwajshing/baileys");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const arrayMove = (arr, old_index, new_index) => {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
};
exports.arrayMove = arrayMove;
const getContentFromMsg = (msg) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    let type = (0, baileys_1.getContentType)(msg.message);
    return type === "conversation" && ((_a = msg.message) === null || _a === void 0 ? void 0 : _a.conversation)
        ? msg.message.conversation
        : type == "imageMessage" && ((_c = (_b = msg.message) === null || _b === void 0 ? void 0 : _b.imageMessage) === null || _c === void 0 ? void 0 : _c.caption)
            ? msg.message.imageMessage.caption
            : type == "documentMessage" && ((_e = (_d = msg.message) === null || _d === void 0 ? void 0 : _d.documentMessage) === null || _e === void 0 ? void 0 : _e.caption)
                ? msg.message.documentMessage.caption
                : type == "videoMessage" && ((_g = (_f = msg.message) === null || _f === void 0 ? void 0 : _f.videoMessage) === null || _g === void 0 ? void 0 : _g.caption)
                    ? msg.message.videoMessage.caption
                    : type == "extendedTextMessage" && ((_j = (_h = msg.message) === null || _h === void 0 ? void 0 : _h.extendedTextMessage) === null || _j === void 0 ? void 0 : _j.text)
                        ? msg.message.extendedTextMessage.text
                        : type == "listResponseMessage"
                            ? (_m = (_l = (_k = msg.message) === null || _k === void 0 ? void 0 : _k.listResponseMessage) === null || _l === void 0 ? void 0 : _l.singleSelectReply) === null || _m === void 0 ? void 0 : _m.selectedRowId
                            : type == "buttonsResponseMessage" &&
                                ((_p = (_o = msg.message) === null || _o === void 0 ? void 0 : _o.buttonsResponseMessage) === null || _p === void 0 ? void 0 : _p.selectedButtonId)
                                ? msg.message.buttonsResponseMessage.selectedButtonId
                                : type == "templateButtonReplyMessage" &&
                                    ((_r = (_q = msg.message) === null || _q === void 0 ? void 0 : _q.templateButtonReplyMessage) === null || _r === void 0 ? void 0 : _r.selectedId)
                                    ? msg.message.templateButtonReplyMessage.selectedId
                                    : "";
};
exports.getContentFromMsg = getContentFromMsg;
const getSender = (msg, client) => {
    return msg.key.fromMe
        ? client.user.id
        : msg.participant
            ? msg.participant
            : msg.key.participant
                ? msg.key.participant
                : msg.key.remoteJid;
};
exports.getSender = getSender;
const walk = (dir, callback) => {
    const files = fs_1.default.readdirSync(dir);
    files.forEach((file) => {
        var filepath = path_1.default.join(dir, file);
        const stats = fs_1.default.statSync(filepath);
        if (stats.isDirectory()) {
            module.exports.walk(filepath, callback);
        }
        else if (stats.isFile()) {
            callback(filepath, stats);
        }
    });
};
exports.walk = walk;
const decodeJid = (jid) => {
    if (!jid)
        return jid;
    if (/:\d+@/gi.test(jid)) {
        let decode = (0, baileys_1.jidDecode)(jid);
        return (((decode === null || decode === void 0 ? void 0 : decode.user) && decode.server && decode.user + "@" + decode.server) || jid);
    }
    else
        return jid;
};
exports.decodeJid = decodeJid;
