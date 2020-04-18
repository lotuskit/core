import { Hash } from "./Hash";
import logger from "../lib/logger";
import { ChannelRole } from "./ChannelRole";
import { ConfigDefault } from "../lib/config-default";

export type SessionExport = {
    id: string;
    u: string;
    m: Hash<any>;
    c: Hash<ChannelRole>;
}

export class Session {
    public handshake_response: any = {};
    private _meta: Hash<any> = {};
    private _is_updated: boolean = false;
    private _username: string;

    private _channels: Hash<ChannelRole> = {};

    constructor(private _id: string,
                private _payload: any,
                import_data?: SessionExport) {

        this._username = `${_id}`;

        // Import data from Redis
        if (import_data) {
            this._id = import_data.id;
            this._username = import_data.u;
            this._meta = import_data.m;
            this._channels = import_data.c;
        }
    }

    static import(data: SessionExport): Session { return new Session('', {}, data); }
    export(): SessionExport {
        return {
            id: this._id,
            u: this._username,
            m: this._meta,
            c: this._channels
        };
    }

    get id(): string { return this._id; }
    get username(): string { return this._username; }
    get payload(): any { return this._payload; }
    get channels(): Hash<ChannelRole> { return this._channels; }
    get is_updated(): boolean { return this._is_updated; }


    /**
     * Set metadata of session
     * @param namespace 
     * @param data 
     */
    setMeta(namespace: string, data: any) {
        this._meta[`${namespace}`] = data;
        this._is_updated = true;
    }

    /**
     * Delete metadata of session
     * @param namespace 
     */
    deleteMeta(namespace: string) {
        delete(this._meta[`${namespace}`]);
        this._is_updated = true;
    }


    /**
     * Define new username for this user
     * @param username to set
     */
    setUsername(username: string) {
        this._username = `${username}`; // stringify
        this._is_updated = true;
    }


    /**
     * Register user into a channel
     * @param name Channel name
     * @param role User role in this channel (r=Read only, w=Read/Write, m=Moderator)
     */
    addChannel(name: string, role: ChannelRole = 'w') {
        name = `${name}`; // stringify channel name

        // Check channel name is valid
        if (!ConfigDefault.CHANNEL_NAME_REGEX.test(name)) {
            logger.error(`Invalid channel name "${name}". Ignored.`);
            return;
        }

        if (!['r', 'w', 'm'].includes(role)) {
            logger.error(`Unknown role "${role}" in channel "${name}". Write role applied by default.`);
            role = 'w';
        }

        this._channels[name] = role;
        this._is_updated = true;
    }

    /**
     * Unregister user from a channel
     * @param name Channel name
     */
    removeChannel(name: string) {
        delete(this._channels[`${name}`]);
        this._is_updated = true;
    }
}
