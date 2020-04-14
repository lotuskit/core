import Redis from "redis";
import helmet from "helmet";
import express from "express";
import logger from "./lib/logger";
import { Socket } from "./socket";
import { WebuiServer } from "./webui/server";

/**
 * Start LotusKit server with Express
 */
export class LotuServer {
    private server: any;
    private socket?: Socket;

    constructor(private config: any,
                private redis: Redis.RedisClient) {

        try {
            /**
             * Express Server Configuration
             */
            const app = express();

            app.use(express.static("src/public"));
            app.use(helmet());
            app.get('/', (req, res) => res.send('Ready'));

            // Bind webui to server
            const webui = new WebuiServer(config, app);

            /**
             * Express Server & Socket.IO Activation
             */
            this.server = app.listen(config.port, () => {
                this.socket = new Socket(config, redis, this.server);
                logger.info(`✓ LotusKit is ready on port ${config.port}!`);
                logger.info('');
                logger.info(`        Websocket:   ${config.protocol === 'https' ? 'wss' : 'ws'}://${config.host}:${config.port}/`);
                logger.info(`  WebUI dashboard:   ${config.protocol}://${config.host}:${config.port}/dashboard`);
                logger.info('');
                logger.info('***************************************************');
            });
        } catch (error) {
            logger.error(error);
            process.exit(1);
        }
    }

    /**
     * Close server
     */
    close(): void {
        if (this.server) this.server.close();
    }
}
