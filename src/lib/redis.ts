import Redis from "redis";
import promise from "bluebird";
import logger from './logger';

promise.promisifyAll(Redis.RedisClient.prototype);
promise.promisifyAll(Redis.Multi.prototype);

export default (redis_url: string): Promise<Redis.RedisClient> => {
    return new Promise((resolve, reject) => {
        logger.info(`[REDIS] Connecting to ${redis_url}...`);
        const connector = Redis.createClient(redis_url);

        connector.on("error", (error) => {
            logger.error('[REDIS] An error occured');
            logger.error(error);
        });

        connector.on("connect", () => {
            logger.info('[REDIS] Connected to server!');
            resolve(connector);
        });
    });
};
