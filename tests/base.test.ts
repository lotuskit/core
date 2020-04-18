import TestHelper from './_test_helper';

let socket: SocketIOClient.Socket;
beforeAll(async (done) => {
    socket = await TestHelper.connect();
    done();
});

describe("Base", () => {
    // Test to send a ping to server
    it("Ping OK", async (done) => {
        TestHelper.expect_response(socket, {
            channel: 'lk:ping',
            response_channel: 'lk:ping'
        }, (data: any) => {
            expect(data).toEqual('pong');
            done();
        });
    });
});

afterAll(() => {
    socket.close();
});
