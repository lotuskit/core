import Validator from "./validator";
import { ConfigDefault } from "../lib/config-default";

export class MessageValidator extends Validator {

    // Message schema
    protected schema = {
        type: 'object',
        required: [
            'channel', 'message'
        ],
        properties: {
            channel: { type: 'string', pattern: ConfigDefault.CHANNEL_NAME_REGEX.toString().slice(1, -1) },
            message: { type: 'string', minLength: 1 }
        }
    }

}