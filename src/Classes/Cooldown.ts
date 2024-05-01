import { Collection } from "@discordjs/collection";
import { decodeJid } from "../Common/Functions";
import { ICtx } from "../Common/Types";
import EventEmitter from "events";

export class Cooldown extends EventEmitter {
    ms: number;
    cooldown: Collection<unknown, unknown> | undefined;
    timeout: number;

    constructor(whasapi: ICtx, ms: number) {
        super();
        this.ms = ms;
        this.cooldown = whasapi._self.cooldown;
        this.timeout = 0;

        let q = `cooldown_${whasapi._used.command}_${decodeJid(whasapi._msg.key.remoteJid as string)}_${decodeJid(whasapi._sender.jid as string)}`;
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