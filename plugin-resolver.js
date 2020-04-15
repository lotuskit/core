const fs = require('fs');

// Read config
const config_filename = './lotuskit.config.json';
const rawconfig = fs.readFileSync(config_filename);
const config = JSON.parse(rawconfig.toString());

// Generate plugins list
const plugins = [];
for (const plugin_path in config.plugins) {
    const plugin_config = config.plugins[plugin_path];
    plugins.push({packagePath: plugin_path, config: plugin_config});
}

// Export plugins
module.exports = plugins;
