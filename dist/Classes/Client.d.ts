/// <reference types="node" />
import { AuthenticationState } from "@adiwajshing/baileys/lib/Types";
import EventEmitter from "events";
import { Collection } from "@discordjs/collection";
import { ClientOptions, CommandOptions } from "../Common/Types";
export declare class Client {
    name: string;
    prefix: Array<string> | string;
    readIncommingMsg?: boolean;
    authDir?: string;
    printQRInTerminal?: boolean;
    state?: AuthenticationState;
    saveCreds?: () => Promise<void>;
    whats?: any;
    ev: EventEmitter;
    cmd?: Collection<unknown, unknown>;
    cooldown?: Collection<unknown, unknown>;
    readyAt?: number;
    constructor(opts: ClientOptions);
    WAVersion(): Promise<[number, number, number]>;
    onConnectionUpdate(): void;
    onCredsUpdate(): void;
    read(m: {
        messages: {
            key: any;
        }[];
    }): void;
    onMessage(): void;
    onGroupParticipantsUpdate(): void;
    onGroupsJoin(): void;
    command(opts: CommandOptions): void;
    launch(): Promise<void>;
}
//# sourceMappingURL=Client.d.ts.map