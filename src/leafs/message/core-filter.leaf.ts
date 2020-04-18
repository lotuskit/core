import { Message } from "../../models/Message";
import { LeafEnv, LeafNext, LeafReject, MessageLeaf } from "../../models/Leaf";

const leaf: MessageLeaf = {
    name: "CoreFilter",
    scope: 'message',
    engine: (env: LeafEnv, message: Message, next: LeafNext, reject: LeafReject): void => {
        // Limit message length
        if (message.content.length > env.config.max_messages_length) {
            message.content = message.content.substr(0, env.config.max_messages_length) + '...';
        }

        next();
    }
}

export default leaf;