import fs from "fs";
import Redis from "redis";
import helmet from "helmet";
import express from "express";
import logger from "./lib/logger";
import { Socket } from "./socket";
import { WebuiServer } from "./webui/server";
import { Metrics } from "./lib/metrics";
import { Plugins } from "./lib/plugins";
import AuthLeaf from "./leafs/handshake/auth.leaf";
import ChannelLeaf from "./leafs/message/channel.leaf";
import CoreFilterLeaf from "./leafs/message/core-filter.leaf";
import { HandshakeLeaf, MessageLeaf } from "./models/Leaf";

/**
 * Start LotusKit server with Express
 */
export class LotuServer {
    private metrics: Metrics;
    private server: any;
    private socket?: Socket;
    private plugins: Plugins;
    private leafs: {handshake: HandshakeLeaf[]; message: MessageLeaf[]};

    constructor(private config: any,
                private redis: Redis.RedisClient) {

        try {
            this.metrics = new Metrics();

            /**
             * Load core leafs
             */
            this.leafs = {
                handshake: [AuthLeaf],
                message: [ChannelLeaf, CoreFilterLeaf]
            }

            /**
             * Express Server Configuration
             */
            const app = express();

            app.use(express.static("src/public"));
            app.use(helmet());
            app.get('/', (req, res) => res.send('Ready'));


            /**
             * Bind WebUI
             */
            const webui = new WebuiServer(config, app, this);
            

            /**
             * Load plugins
             */
            logger.info("Loading plugins...");
            this.plugins = new Plugins(config);
            this.plugins.load().then(
                () => {
                    /**
                     * Append loaded leafs from plugins
                     */
                    this.leafs.handshake = this.leafs.handshake.concat(this.plugins.leafs.handshake);
                    this.leafs.message = this.leafs.message.concat(this.plugins.leafs.message);
                    
                    /**
                     * Express Server & Socket.IO Activation
                     */
                    this.server = app.listen(config.port, () => {
                        this.socket = new Socket(config, redis, this.server, this.leafs, this.metrics);
                        logger.info(`✓ LotusKit is ready on port ${config.port}!`);
                        logger.info('');
                        logger.info(`        Websocket:   ${config.protocol === 'https' ? 'wss' : 'ws'}://${config.host}:${config.port}/`);
                        logger.info(`  WebUI dashboard:   ${config.protocol}://${config.host}:${config.port}/dashboard`);
                        logger.info('');
                        logger.info('***************************************************');
                    });
                }
            );
        } catch (error) {
            logger.error(error);
            process.exit(1);
        }
    }

    getConfig(): any {
        return this.config;
    }

    saveConfig(config: any): void {
        fs.writeFile('./lotuskit.config.json', JSON.stringify(config, null, 4), (err) => {
            if (err) {
                logger.error(`Unable to save updated configuration:`, err);
            } else {
                logger.info(`Updated configuration!`);
            }
        });
    }

    getLeafs(): {handshake: HandshakeLeaf[]; message: MessageLeaf[]} {
        return this.leafs;
    }

    getPlugins(): any {
        return this.plugins.plugins;
    }

    /**
     * Return server info to be displayed on dashboard
     */
    stats() {
        const socket_stats = this.socket?.stats();

        return {
            connexions_count: socket_stats?.connexions_count,
            metrics: this.metrics.getData()
        };
    }

    /**
     * Close server
     */
    close(): void {
        if (this.server) this.server.close();
    }
}
