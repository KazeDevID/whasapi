export = Collector;
declare class Collector extends EventEmitter {
    constructor(options?: {});
    isRun: false | NodeJS.Timeout;
    filter: any;
    time: any;
    max: any;
    maxProcessed: any;
    collector: Collection<any, any>;
    collect(t: any): Promise<void>;
    stop(r?: string): void;
}
import EventEmitter = require("events");
import { Collection } from "@discordjs/collection";
//# sourceMappingURL=Collector.d.ts.map