const fs = require('fs');

// Read config
const config_filename = './lotuskit.config.json';
const rawconfig = fs.readFileSync(config_filename);
const server_config = JSON.parse(rawconfig.toString());

// Generate plugins list
const plugins = [];
for (const plugin_path in server_config.plugins) {
    const plugin_config = server_config.plugins[plugin_path];

    plugins.push({
        packagePath: plugin_path,
        config: {
            plugin: plugin_config,
            server: server_config
        }
    });
}

// Export plugins
module.exports = plugins;
