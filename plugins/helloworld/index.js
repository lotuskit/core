module.exports = function setup(options, imports, register) {
    register(null, {
        helloworldtext: (env, message, next, reject) => {
            message.content += imports.hellotext;
            next();
        }
    });
};
