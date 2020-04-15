import { Session } from "../../models/Session";
import { LeafEnv, LeafNext, LeafReject, HandshakeLeaf } from "../../models/Leaf";

const leaf: HandshakeLeaf = {
    name: "Auth",
    scope: "handshake",
    engine: (env: LeafEnv, session: Session, next: LeafNext, reject: LeafReject): void => {
        session.handshake_response.authy = true;
    
        // Add general channel
        session.addChannel('general');
    
        next();
    }
}

export default leaf;