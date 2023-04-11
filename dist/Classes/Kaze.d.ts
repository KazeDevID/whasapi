import { Collection } from "@discordjs/collection";
import { CollectorArgs, KazeInterface } from "../Common/Types";
import MessageCollector from "./Collector/MessageCollector";
export declare class Kaze implements KazeInterface {
    _used: {
        prefix: string | string[];
        command: string;
    };
    _args: string[];
    _self: any;
    _client: any;
    _msg: any;
    _sender: {
        jid: string;
        pushName: string;
    };
    _config: {
        name: string;
        prefix: string | String[];
        cmd: Collection<unknown, unknown>;
    };
    constructor(options?: {
        used: {};
        args: string[];
        self: {};
        client: undefined;
    });
    get id(): string;
    get args(): Array<string>;
    get msg(): any;
    get sender(): {
        jid: string;
        pushName: string;
    };
    sendMessage(jid: string, content: object, options?: {}): Promise<void>;
    reply(content: object, options?: {}): Promise<void>;
    replyWithJid(jid: string, content: object, options?: {}): Promise<void>;
    react(jid: string, emoji: string, key?: object): Promise<void>;
    MessageCollector(args?: CollectorArgs): MessageCollector;
    awaitMessages(args?: CollectorArgs): Promise<unknown>;
}
//# sourceMappingURL=Kaze.d.ts.map