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

export default class ConfigValidator extends Validator {

    // Config schema
    protected schema = {
        type: 'object',
        required: [
            'port', 'redis_url', 'webui', 'modules'
        ],
        properties: {
            port: { type: 'number', minimum: 1 },
            redis_url: { type: 'string' },
            webui,
            modules: { type: 'array' }
        }
    }

}
