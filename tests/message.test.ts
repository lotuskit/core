import TestHelper from './_test_helper';

let socket: SocketIOClient.Socket;
beforeAll(async (done) => {
    socket = await TestHelper.connect();

    // Do a Handshake
    TestHelper.expect_response(socket, {
        channel: 'lk:handshake',
        response_channel: 'lk:handshake'
    }, (data: any) => {
        expect(data).toBeTruthy();
        done();
    });
});

describe("Message", () => {
    it("should fail w/ empty message", async (done) => {
        TestHelper.expect_response(socket, {
            channel: 'lk:message',
            response_channel: 'lk:message'
        }, (data: any) => {
            expect(data.result).toEqual(false);
            expect(data.error).toEqual('INVALID_MESSAGE_FORMAT');
            done();
        });
    });

    it("should fail w/ invalid channel", async (done) => {
        TestHelper.expect_response(socket, {
            channel: 'lk:message',
            response_channel: 'lk:message',
            data: {
                channel: ']6-0u ',
                message: 'hello'
            }
        }, (data: any) => {
            expect(data.result).toEqual(false);
            expect(data.error).toEqual('INVALID_MESSAGE_FORMAT');
            done();
        });
    });

    it("should fail w/ invalid message", async (done) => {
        TestHelper.expect_response(socket, {
            channel: 'lk:message',
            response_channel: 'lk:message',
            data: {
                channel: 'general',
                message: ''
            }
        }, (data: any) => {
            expect(data.result).toEqual(false);
            expect(data.error).toEqual('INVALID_MESSAGE_FORMAT');
            done();
        });
    });

    it("should fail w/ not subscribed channel", async (done) => {
        TestHelper.expect_response(socket, {
            channel: 'lk:message',
            response_channel: 'lk:message',
            data: {
                channel: 'invalid-channel',
                message: 'hello'
            }
        }, (data: any) => {
            expect(data.result).toEqual(false);
            expect(data.error).toEqual('INVALID_CHANNEL');
            done();
        });
    });

    it("should succeed w/ valid channel & message", async (done) => {
        let has_received_response = false;
        let has_received_message = false;

        socket.once('lk:channels', (msg: any) => {
            expect(msg.m).toEqual('hello');
            expect(msg.c).toEqual(['general']);

            has_received_message = true;
            if (has_received_message && has_received_response) {
                done();
            }
        });

        TestHelper.expect_response(socket, {
            channel: 'lk:message',
            response_channel: 'lk:message',
            data: {
                channel: 'general',
                message: 'hello'
            }
        }, (data: any) => {
            expect(data.result).toEqual(true);
            has_received_response = true;
            if (has_received_message && has_received_response) {
                done();
            }
        });
    });
});
