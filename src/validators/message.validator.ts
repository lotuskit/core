import Validator from "./validator";

export class MessageValidator extends Validator {

    // Message schema
    protected schema = {
        type: 'object',
        required: [
            'channel', 'message'
        ],
        properties: {
            channel: { type: 'string' },
            message: { type: 'string' }
        }
    }

}