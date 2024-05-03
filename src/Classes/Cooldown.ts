import { Collection } from "@discordjs/collection";
import { decodeJid } from "../Common/Functions";
import { ISock } from "../Common/Types";
import EventEmitter from "events";

export class Cooldown extends EventEmitter {
    ms: number;
    cooldown: Collection<unknown, unknown> | undefined;
    timeout: number;

    constructor(sock: ISock, ms: number) {
        super();
        this.ms = ms;
        this.cooldown = sock._self.cooldown;
        this.timeout = 0;

        let q = `cooldown_${sock._used.command}_${decodeJid(sock._msg.key.remoteJid as string)}_${decodeJid(sock._sender.jid as string)}`;
        const get = this.cooldown?.get(q);
        if (get) {
            this.timeout = Number(get) - Date.now();
          } else {
            this.cooldown?.set(q, Date.now() + ms);
            setTimeout(() => {
                this.cooldown?.delete(q);
                this.emit("end");
            }, ms);
          }
    }
    
    get onCooldown(): boolean {
        return this.timeout ? true : false;
    }

    get timeleft(): number {
        return this.timeout;
    }
}