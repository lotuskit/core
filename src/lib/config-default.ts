/**
 * Default or Internal configuration
 */
export class ConfigDefault {
    static REDIS_CONNECTION_TIMEOUT_IN_MS: number = 5000;
    static SESSION_DURATION_IN_MIN: number = 60;
    static MAX_MESSAGES_HISTORY_PER_CHANNEL: number = 100;
    static METRICS_WINDOW_IN_MIN: number = 1;
    static CHANNEL_NAME_REGEX = /^[a-zA-Z0-9-_/]{1,255}$/;

    static EVENTS = {
        PING: 'lk:ping',
        HANDSHAKE: 'lk:handshake',
        MESSAGE: 'lk:message',
        CHANNELS_BROADCAST: 'lk:channels'
    }
}
