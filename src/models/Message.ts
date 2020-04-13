import { Session } from "./Session";

export class Message {
    public channel?: string = undefined;
    private _original_content: string;

    constructor(private _sender: Session,
                public content: string) {

        // Copy content to read/only attribute
        this._original_content = `${content}`;

        // Decode channel
        this.channel = 'toto';
    
    }

    get sender(): Session {
        return this._sender;
    }

    get original_content(): string {
        return this._original_content;
    }
}