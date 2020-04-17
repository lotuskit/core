export class Session {
    public username: string;
    public storage: any = {};
    public handshake_response: any = {};

    private _channels: string[] = [];

    constructor(private _id: string,
                private _payload: any,
                import_data?: string) {

        this.username = `${_id}`;

        // Import data from Redis
        if (import_data) {
            const data = JSON.parse(import_data);

            this._id = data.id;
            this.username = data.u;
            this.storage = data.s;
            this._channels = data.c;
        }
    }

    static import(data: string): Session { return new Session('', {}, data); }
    export(): string {
        return JSON.stringify({
            id: this._id,
            u: this.username,
            s: this.storage,
            c: this._channels
        });
    }

    get id(): string { return this._id; }
    get payload(): any { return this._payload; }
    get channels(): string[] { return this._channels; }

    addChannel(channel: string) {
        if (!this._channels.includes(channel)) {
            this._channels.push(channel);
        }
    }

    removeChannel(channel: string) {
        const index = this._channels.indexOf(channel);
        if (index > -1) this._channels.splice(index, 1);
    }
}