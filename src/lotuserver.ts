import Redis from "redis";
import helmet from "helmet";
import express from "express";
import socketio from "socket.io";
import logger from "./lib/logger";

/**
 * Start LotusKit server with Express and Socket.io
 */
export default class LotuServer {
    private server: any;
    private io?: socketio.Server;

    constructor(private config: any,
                private redis: Redis.RedisClient) {

        try {
            /**
             * Express Server Configuration
             */
            const app = express();

            app.use(express.static("src/public"));
            app.set("views", "src/webui/views");
            app.set("view engine", "ejs");
            app.use(helmet());
            app.get('/', (req, res) => res.send('READY'));

            /**
             * Express Server & Socket.IO Activation
             */
            this.server = app.listen(config.port, () => {
                this.io = socketio.listen(this.server);

                // On new socket incoming data...
                this.io.on('connection', (socket: socketio.Socket) => {
                    socket.on('handshake', (data: any) => this.onSocketHandshake(socket, data));
                    socket.on('message', (data: any) => this.onSocketMessage(socket, data));
                });

                logger.info(`✓ LotusKit is ready! Listening on port ${config.port}.`);
            });
        } catch (error) {
            logger.error(error);
            process.exit(1);
        }
    }

    /**
     * On new incoming socket handshake
     */
    onSocketHandshake(socket: socketio.Socket, data: any) {

    }

    /**
     * On new incoming socket message
     */
    onSocketMessage(socket: socketio.Socket, data: any) {

    }

    /**
     * Close server
     */
    close(): void {
        if (this.server) this.server.close();
    }
}
