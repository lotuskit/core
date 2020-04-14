import { Message } from "../../models/Message";
import { AbstractMessageLeaf, LeafNext, LeafReject } from "../../models/Leaf";

export class ChannelLeaf extends AbstractMessageLeaf {
    
    public handle(message: Message, next: LeafNext, reject: LeafReject) {
        // Check channel
        if (message.original_channel && message.sender.channels.includes(message.original_channel)) {
            // OK
            next();
            return;
        }
        
        reject({code: 'INVALID_CHANNEL'});
    }

}
