import { Session } from "../../models/Session";
import { AbstractHandshakeLeaf, LeafNext, LeafReject } from "../../models/Leaf";

export class AuthLeaf extends AbstractHandshakeLeaf {
    
    public handle(session: Session, next: LeafNext, reject: LeafReject) {
        session.handshake_response.authy = true;

        // Add general channel
        session.addChannel('general');
        
        next();
    }

}
