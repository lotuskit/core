const Ajv = require('ajv');

const LotusKitPlugin = (plugin) => {
    return function setup(options, rawimports, register) {
        // Fetch plugin name
        const plugin_name = options.name;
        if(!plugin_name) throw new Error("Missing plugin.name in package.json");

        // Transform imports from "plugin_name/attr" to plugin_name.attr
        const imports = {};
        for (const key in rawimports) {
            const parts = key.split('/', 2);
            const import_plugin_name = parts[0],
                  import_data_name = parts[1];

            // If plugin does not exists yet, create it
            if (!imports[import_plugin_name]) {
                imports[import_plugin_name] = {}
            }

            // Append data
            imports[import_plugin_name][import_data_name] = rawimports[key];
        }

        // Run plugin to generate leafs
        const leafs = plugin(options.config, imports);

        // Prepend all leafs names by plugin names
        const provides = {};
        for (const leaf_name in leafs) {
            provides[`${plugin_name}/${leaf_name}`] = leafs[leaf_name];
        }

        // Register into Architect
        register(null, provides);
    };
}

///////////

module.exports = LotusKitPlugin(
    (config, imports) => {
        return {
            helloworldtext: {
                name: 'HelloWorld',
                type: 'leaf',
                scope: 'message',
                engine: (env, message, next, reject) => {
                    message.content += imports.hellotext.text;
                    next();
                }
            }
        };
    }
);