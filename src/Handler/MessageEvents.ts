import { Sock } from "../Classes/Sock";
import { Events } from "../Constant/Events";
import { MessageType } from "../Constant/MessageType";

export const emitPollCreation = async (m: any, ev: any, self: any, core: any) => {
    m.content = m.message.pollCreationMessage.name;
    m.pollValues = m.message.pollCreationMessage.options.map((x: any) => x.optionName);
    m.pollSingleSelect = Boolean(m.message.pollCreationMessage.selectableOptionsCount);
    ev?.emit(Events.Poll, m, new Sock({ used: { poll: m.content }, args: [], self: self, client: core }));
}

export const emitPollUpdate = async(m: any, ev: any, self: any, core: any) => {
    ev?.emit(Events.PollVote, m, new Sock({ used: { pollVote: m.content }, args: [], self: self, client: core }));
}

export const emitReaction = async(m: any, ev: any, self: any, core: any) => {
    ev.emit(Events.Reactions, m, new Sock({ used: { reactions: m.content }, args: [], self: self, client: core }));
}

export const MessageEventList = {
    [MessageType.pollCreationMessage]: emitPollCreation,
    [MessageType.pollUpdateMessage]: emitPollUpdate,
    [MessageType.reactionMessage]: emitReaction,
}