"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Collection } = require("@discordjs/collection");
var EventEmitter = require("events");
module.exports = class Collector extends EventEmitter {
    constructor(options = {}) {
        var _a;
        super();
        this.isRun = false;
        this.filter = (_a = options.filter) !== null && _a !== void 0 ? _a : (() => true);
        if (this.isRun)
            throw new Error("some collector already run in another instance");
        if (typeof this.filter !== "function")
            throw new Error("filter options in collector must be Function");
        this.time = options.time;
        this.max = options.max;
        this.maxProcessed = options.maxProcessed;
        this.collector = new Collection();
        this.collect = this.collect.bind(this);
        if (options.time)
            this.isRun = setTimeout(() => this.stop(), this.time);
    }
    collect(t) {
        return __awaiter(this, void 0, void 0, function* () {
            let args = this._collect(t);
            if (args) {
                if (this.maxProcessed && this.maxProcessed === this.received) {
                    this.stop("processedLimit");
                }
                else {
                    let filtered = yield this.filter(args, this.collector);
                    if (filtered) {
                        if (this.max && this.max <= this.collector.size) {
                            this.stop("limit");
                        }
                        else {
                            if (this.isRun) {
                                this.collector.set(args.jid, args);
                                this.emit("collect", args);
                            }
                        }
                    }
                }
            }
        });
    }
    stop(r = "timeout") {
        if (this.isRun) {
            clearTimeout(this.isRun);
            this.isRun = undefined;
            this.emit("end", this.collector, r);
        }
    }
};
