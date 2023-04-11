import { Collection } from "@discordjs/collection";
import { Kaze } from "../Classes/Kaze";
export interface ClientOptions {
    name: string;
    prefix: Array<string> | string;
    readIncommingMsg?: boolean;
    authDir?: string;
    printQRInTerminal?: boolean;
}
export interface CommandOptions {
    name: string;
    aliases?: Array<string>;
    code: (kaze: Kaze) => Promise<any>;
}
export interface SectionsOptions {
    title: string;
    rows: SectionsRows[];
}
export interface SectionsRows {
    title: string;
    rowId: number;
    description?: string;
}
export interface CollectorArgs {
    time?: number;
    max?: number;
    endReason?: string[];
    maxProcessed?: number;
    filter?: () => boolean;
}
export interface KazeInterface {
    _used: {
        prefix: Array<string> | string;
        command: string;
    };
    _args: Array<String>;
    _self: any;
    _client: any;
    _msg: any;
    _sender: {
        jid: string;
        pushName: string;
    };
    _config: {
        name: string;
        prefix: string | Array<String>;
        cmd: Collection<unknown, unknown>;
    };
}
//# sourceMappingURL=Types.d.ts.map