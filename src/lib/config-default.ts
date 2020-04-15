/**
 * Default or Internal configuration
 */
export class ConfigDefault {
    static REDIS_CONNECTION_TIMEOUT_IN_MS: number = 5000;
    static SESSION_DURATION_IN_MIN: number = 60;
    static MAX_MESSAGES_HISTORY_PER_CHANNEL: number = 100;
    static METRICS_WINDOW_IN_MIN: number = 1;
}
