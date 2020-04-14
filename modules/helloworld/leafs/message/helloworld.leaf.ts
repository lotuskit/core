// import { Message } from "../../models/Message";
// import { AbstractMessageLeaf, LeafNext, LeafReject } from "../../models/Leaf";

export class ChannelLeaf {
    
    public handle(message: any, next: any, reject: any) {
        // Append "Hello world"
        message.content += " Hello World";
        
        next();
    }

}
