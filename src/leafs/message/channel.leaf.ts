import { Message } from "../../models/Message";
import { AbstractMessageLeaf, LeafNext, LeafReject } from "../../models/Leaf";

export class ChannelLeaf extends AbstractMessageLeaf {
    
    public handle(message: Message, next: LeafNext, reject: LeafReject) {
        // Check channel
        if (message.channel && message.sender.channels.includes(message.channel)) {
            // OK
            next();
            return;
        }
        
        reject('Invalid channel');
    }

}
