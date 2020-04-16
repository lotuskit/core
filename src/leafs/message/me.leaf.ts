import { Message } from "../../models/Message";
import { LeafEnv, LeafNext, LeafReject, MessageLeaf } from "../../models/Leaf";

const leaf: MessageLeaf = {
    name: "/me",
    scope: 'message',
    engine: (env: LeafEnv, message: Message, next: LeafNext, reject: LeafReject): void => {
        // if message if beginning by /me, replce it by sender username
        if (message.content.substring(0, 4) === '/me ') {
            message.content = `* ${message.sender.username} ${message.content.substring(4)}`;
        }
        
        // Next leaf
        next();
    }
}

export default leaf;