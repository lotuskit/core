import { Session } from "./Session";

export type MessageExport = {
    t: number;
    m: string;
    u: string;
    c: string[];
}

export class Message {
    public content: string;
    private _timestamp: number;
    private _original_content: string;
    private _original_channel: string;
    private _broadcasted_channels: string[];

    constructor(private _sender: Session,
                payload: {channel: string; message: string}) {

        // Generate timestamp
        this._timestamp = new Date().getTime();

        // Copy content to read/only attribute
        this._original_content = `${payload.message}`;
        this.content = `${payload.message}`;

        // Save channel
        this._original_channel = `${payload.channel}`;
        this._broadcasted_channels = [`${payload.channel}`];
    }

    get timestamp(): number {
        return this._timestamp;
    }

    get sender(): Session {
        return this._sender;
    }

    get original_content(): string {
        return this._original_content;
    }

    get original_channel(): string {
        return this._original_channel;
    }

    get broadcasted_channels(): string[] {
        return this._broadcasted_channels;
    }

    /**
     * Add a channel where to broadcast message
     * @param channel string
     */
    addBroadcastChannel(channel: string): void {
        if (!this._broadcasted_channels.includes(channel)) {
            this._broadcasted_channels.push(channel);
        }
    }

    /**
     * Remove a channel where to broadcast message
     * @param channel string
     */
    removeBroadcastChannel(channel: string): void {
        const index = this._broadcasted_channels.indexOf(channel);
        if (index > -1) this._broadcasted_channels.splice(index, 1);
    }

    /**
     * Remove all channels where to broadcast message
     */
    clearBroadcastChannels(): void {
        this._broadcasted_channels = [];
    }

    export(): MessageExport {
        return {
            t: this.timestamp,
            m: this.content,
            u: this.sender.username,
            c: this.broadcasted_channels
        };
    }
}