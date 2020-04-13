import { configure, getLogger, Logger } from 'log4js';

configure({
    appenders: {
        console: { type: 'console' },
        all: { type: 'file', filename: 'log/all.log' },
        errors: { type: 'file', filename: 'log/errors.log' },
        errorsFilter: { type: 'logLevelFilter', appender: 'errors', level: 'ERROR' },
    },

    categories: {
        default: { appenders: ['console', 'all', 'errorsFilter'], level: 'all' },
    }
});

class LoggerSingleton {
    private static logger: Logger;

    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() { }

    /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Singleton class while keeping
     * just one instance of each subclass around.
     */
    public static getInstance(): Logger {
        if (!LoggerSingleton.logger) {
            LoggerSingleton.logger = getLogger();
        }

        return LoggerSingleton.logger;
    }
}

export default LoggerSingleton.getInstance();
