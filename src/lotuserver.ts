import Redis from "redis";
import helmet from "helmet";
import express from "express";
import socketio from "socket.io";
import logger from "./lib/logger";
import webui_routes from "./webui/routes";
import { AuthLeaf } from "./leafs/handshake/auth.leaf";
import { Striper } from "./models/Striper";
import { Session } from "./models/Session";
import ConfigDefault from "./lib/config-default";
import { Message } from "./models/Message";
import { ChannelLeaf } from "./leafs/message/channel.leaf";

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
            app.use("/dashboard", webui_routes);
            app.get('/', (req, res) => res.send('Ready'));

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
    onSocketHandshake(socket: socketio.Socket, payload: any) {
        // Create session
        const session = new Session(socket.id, payload);

        const leafClasses = [AuthLeaf];

        /**
         * Process payload through leafs
         */
        Striper.strip(this.redis, session, leafClasses)
        .then(
            // If handshake approved...
            () => {
                // Save it to Redis
                this.redis.setex(`lotuskit:session:${socket.id}`,
                                 ConfigDefault.SESSION_DURATION_IN_MIN,
                                 session.export());

                // Subscribe to channels
                for (const channel of session.channels) {
                    socket.join(`channel:${channel}`);
                }

                // Respond
                socket.emit('handshake:approved', session.handshake_response);
            }
        ).catch(
            // If handshake rejected...
            (reason: any) => {
                logger.warn(`Handshake rejected for client with payload:`, payload);
                socket.emit('handshake:rejected', reason);
            }
        );
    }

    /**
     * On new incoming socket message
     */
    onSocketMessage(socket: socketio.Socket, payload: any) {
        // Fetch data from Redis
        this.redis.get(`lotuskit:session:${socket.id}`,
            (error: any, session_data: string) => {
                // If error...
                if (error) {
                    //todo
                    logger.error(error);
                    return;
                }

                // Session not found
                if (!session_data) {
                    //todo
                    logger.warn(session_data);
                    return;
                }

                // Import session
                const session: Session = Session.import(session_data);

                // Instanciate message
                const message = new Message(session, `${payload}`);

                const leafClasses = [ChannelLeaf];

                /**
                 * Process payload through leafs
                 */
                console.log('striping...');
                Striper.strip(this.redis, message, leafClasses)
                .then(
                    // If message approved...
                    () => {
                        console.log(">>>", message.content);
                        socket.emit('message:approved', {});
                    }
                ).catch(
                    // If message rejected...
                    (reason: any) => {
                        socket.emit('message:rejected', reason);
                    }
                );
            }
        );
    }

    /**
     * Close server
     */
    close(): void {
        if (this.server) this.server.close();
    }
}
