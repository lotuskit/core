import { Message } from "../../models/Message";
import { LeafEnv, LeafNext, LeafReject, MessageLeaf } from "../../models/Leaf";

const leaf: MessageLeaf = {
    name: "ChannelFilter",
    scope: 'message',
    engine: (env: LeafEnv, message: Message, next: LeafNext, reject: LeafReject): void => {
        // Fetch user role in the channel
        const role = message.sender.channels[message.original_channel];

        // If user is not registered in this channel...
        if (!role) {
            reject('INVALID_CHANNEL');
            return;
        }

        // If user is read only in this channel...
        if (role === 'r') {
            reject('READ_ONLY_CHANNEL');
            return;
        }

        // OK
        next();
    }
}

export default leaf;