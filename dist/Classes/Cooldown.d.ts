/// <reference types="node" />
import { Collection } from "@discordjs/collection";
import { KazeInterface } from "../Common/Types";
import EventEmitter from "events";
export declare class Cooldown extends EventEmitter {
    ms: number;
    cooldown: Collection<unknown, unknown>;
    timeout: number;
    constructor(kaze: KazeInterface, ms: number);
    get onCooldown(): boolean;
    get timeleft(): number;
}
//# sourceMappingURL=Cooldown.d.ts.map