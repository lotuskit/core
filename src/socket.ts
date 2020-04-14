import Redis from "redis";
import socketio from "socket.io";
import logger from "./lib/logger";
import { AuthLeaf } from "./leafs/handshake/auth.leaf";
import { Striper } from "./models/Striper";
import { Session } from "./models/Session";
import { ConfigDefault } from "./lib/config-default";
import { Message } from "./models/Message";
import { ChannelLeaf } from "./leafs/message/channel.leaf";
import { MessageValidator } from "./validators/message.validator";

/**
 * Start Socket.io server and register events
 */
export class Socket {
    private io: socketio.Server;

    constructor(private config: any,
                private redis: Redis.RedisClient,
                private server: any) {

        try {
            this.io = socketio.listen(this.server);

            // On new socket incoming data...
            this.io.on('connection', (socket: socketio.Socket) => {
                socket.on('handshake', (data: any) => this.onSocketHandshake(socket, data));
                socket.on('message', (data: any) => this.onSocketMessage(socket, data));
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
                // Save session to Redis
                this.redis.setex(`lotuskit:session:${socket.id}`,
                ConfigDefault.SESSION_DURATION_IN_MIN,
                session.export());

                // Load messages from all channels
                let loaded_channels_count = 0;
                const expected_channels_count = session.channels.length;
                const channels_messages: any = {};

                for (const channel of session.channels) {
                    // Fetch on redis
                    this.redis.lrange(`chat:channel:${channel}`, -ConfigDefault.MAX_MESSAGES_HISTORY_PER_CHANNEL, -1, function (error, data) {
                        channels_messages[channel] = data.map((m: string) => JSON.parse(m));
                        loaded_channels_count++;

                        // If all channels are fetched --> send handshake response
                        if (loaded_channels_count === expected_channels_count) {
                            socket.emit('handshake', {
                                result: true,
                                data: session.handshake_response,
                                channels: channels_messages
                            });
                        }
                    });
                }

                // Subscribe to channels
                for (const channel of session.channels) {
                    socket.join(`channel:${channel}`);
                }
            }
        ).catch(
            // If handshake rejected...
            (error: any) => {
                logger.warn(`Handshake rejected for client with payload:`, payload);
                socket.emit('handshake', {
                    result: false,
                    error
                });
            }
        );
    }

    /**
     * On new incoming socket message
     */
    onSocketMessage(socket: socketio.Socket, payload: any) {
        // Validate message format
        const msgErrors = new MessageValidator().validate(payload);
        if (msgErrors) {
            socket.emit('message', {
                result: false,
                error: {code: 'INVALID_MESSAGE_FORMAT', details: msgErrors}
            });
            return;
        }

        // Fetch data from Redis
        this.redis.get(`lotuskit:session:${socket.id}`,
            (error: any, session_data: string) => {
                // If error...
                if (error) {
                    logger.error(`[REDIS] Error while fetching session for socket "${socket.id}":`);
                    logger.error(error);
                    return;
                }

                // Session not found (expired) --> Request new Auth
                if (!session_data) {
                    socket.emit('message', {
                        result: false,
                        error: {code: 'HANDSHAKE_NEEDED'}
                    });
                    return;
                }

                // Import session
                const session: Session = Session.import(session_data);

                // Instanciate message
                const message = new Message(session, payload);

                const leafClasses = [ChannelLeaf];

                /**
                 * Process payload through leafs
                 */
                Striper.strip(this.redis, message, leafClasses)
                .then(
                    // If message approved...
                    () => {
                        socket.emit('message', {
                            result: true
                        });

                        // Export message
                        const exportedMsg = message.export();

                        // Save it into Redis & broadcast
                        for (const channel of message.broadcasted_channels) {
                            this.io.to(`channel:${channel}`).emit('channels', exportedMsg);

                            // Append at the end of Redis list
                            const redis_key = `chat:channel:${channel}`;
                            this.redis.rpush(redis_key, JSON.stringify(exportedMsg));

                            // Trim Redis list history
                            this.redis.ltrim(redis_key, -ConfigDefault.MAX_MESSAGES_HISTORY_PER_CHANNEL, -1);
                        }
                    }
                ).catch(
                    // If message rejected...
                    (error: any) => {
                        socket.emit('message', {
                            result: false,
                            error
                        });
                    }
                );
            }
        );
    }
}