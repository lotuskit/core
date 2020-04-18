import Ajv from "ajv";

export default abstract class Validator {
    protected schema = {};

    // Validate configuration
    validate(data: any) {
        const ajv = new Ajv();
        return ajv.validate(this.schema, data) ? null : ajv.errorsText();
    }
}
