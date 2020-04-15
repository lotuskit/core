import { Message } from "../../models/Message";
import { LeafEnv, LeafNext, LeafReject, MessageLeaf } from "../../models/Leaf";

const leaf: MessageLeaf = (env: LeafEnv, message: Message, next: LeafNext, reject: LeafReject): void => {
    // Check channel
    if (message.original_channel && message.sender.channels.includes(message.original_channel)) {
        // OK
        next();
        return;
    }
    
    reject({code: 'INVALID_CHANNEL'});
}

export default leaf;