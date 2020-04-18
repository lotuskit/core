/**
 * Validate configuration format with Ajv,
 * according to predefined schema
 * @return null if configuration is valid, else a string of explained errors
 */

import Validator from "./validator";

/**
 * Schema for WEBUI
 */
const webui = {
    type: 'object',
    required: ['operators'],
    properties: {
        operators: {
            type: 'array',
            items: {
                type: 'object',
                required: ['username', 'password'],
                properties: {
                    username: { type: 'string' },
                    password: { type: 'string' }
                }
            }
        }
    }
}

export class ConfigValidator extends Validator {

    // Config schema
    protected schema = {
        type: 'object',
        required: [
            'protocol', 'host', 'port', 'redis_url', 'webui', 'plugins', 'max_messages_length', 'allowed_origins'
        ],
        properties: {
            protocol: { type: 'string', pattern: '^http[s]{0,1}$' },
            host: { type: 'string' },
            port: { type: 'number', minimum: 1 },
            redis_url: { type: 'string' },
            webui,
            plugins: { type: 'object' },
            max_messages_length: { type: 'number', minimum: 1, maximum: 5000 },
            allowed_origins: {
                type: 'array',
                items: {
                    type: 'string'
                }
            }
        }
    }

}
