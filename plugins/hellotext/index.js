var faker = require('faker');

module.exports = function setup(options, imports, register) {
    register(null, {
        'hellotext/text': faker.name.findName() //options.config.plugin.text
    });
};