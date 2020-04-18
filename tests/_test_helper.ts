import io from 'socket.io-client';

export default class TestHelper {
    static SERVER_URL = "http://localhost:8080";

    /**
     * Connect to server via socket
     */
    static connect(): Promise<SocketIOClient.Socket> {
        return new Promise((resolve) => {
            const socket = io.connect(TestHelper.SERVER_URL, {
                transports: ['websocket']
            });

            socket.on('connect', () => {
                resolve(socket);
            });
        });
    }

    static expect_response(socket: SocketIOClient.Socket,
                           params: {channel: string; data?: any; response_channel: string},
                           callback: (data: any) => void) {
        socket.once(params.response_channel, (data: any) => {
            callback(data);
        });
        socket.emit(params.channel, params.data);
    }
}
