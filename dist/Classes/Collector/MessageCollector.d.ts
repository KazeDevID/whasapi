export = MessageCollector;
declare class MessageCollector extends Collector {
    constructor(clientReq: any, options?: {});
    clientReq: any;
    jid: any;
    received: number;
    _collect(msg: any): any;
}
import Collector = require("./Collector");
//# sourceMappingURL=MessageCollector.d.ts.map