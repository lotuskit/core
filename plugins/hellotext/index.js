module.exports = function setup(options, imports, register) {
    register(null, {
        hellotext: options.config.text
    });
};