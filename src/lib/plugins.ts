import Ajv from "ajv";
import logger from "./logger";
import architectLib, { Architect } from "architect";
import { HandshakeLeaf, MessageLeaf } from "../models/Leaf";
import { isArray } from "util";

export type Plugin = {
    name: string;
    version: string;
    author: string;
    leafs_count: number;
}

export class Plugins {
    private _plugins: Plugin[] = [];
    private _leaf_names: string[] = [];
    private _leafs: MessageLeaf[] = [];
    
    constructor(private config: any) {}

    // Load plugins
    load(): Promise<void> {
        const plugins_count = Object.keys(this.config.plugins).length;

        return new Promise((resolve) => {
            // If no plugins, do nothing
            if (plugins_count === 0) {
                logger.info(`No plugins loaded.`);
                resolve();
                return;
            }

            // Load configuration
            architectLib.loadConfig(process.cwd() + '/plugin-resolver.js', (err, architectConfig) => {
                if (err) {
                    logger.error('Unable to load plugins:', err);
                    process.exit(1);
                }

                // Fetch leaf names
                for (const plugin of architectConfig) {
                    // Validate config if needed
                    if (plugin.configSchema) {
                        const ajv = new Ajv({ allErrors: true });
                        if (!ajv.validate(plugin.configSchema, plugin.config.plugin)) {
                            logger.error(`Invalid plugin configuration:`);
                            logger.error(`  Plugin: ${plugin.packagePath}`);
                            logger.error(`  Error: ${ajv.errorsText()}`);
                            process.exit(1);
                        }
                    }

                    // Mountable leafs
                    if (!plugin.mount || !isArray(plugin.mount)) continue;
                    this._leaf_names = this._leaf_names.concat(plugin.mount);

                    // Save plugin
                    this._plugins.push({
                        name: plugin.name,
                        version: plugin.version,
                        author: plugin.author,
                        leafs_count: plugin.mount.length
                    });
                }
                
                // Create architect app from configuration
                architectLib.createApp(architectConfig, (err, app) => {
                    if (err) {
                        logger.error('Could not start plugins engine:', err);
                        process.exit(2);
                    }

                    // Load leafs
                    for (const leaf_name of this._leaf_names) {
                        this._leafs.push(app.getService(leaf_name));
                    }

                    // Plugins are loaded and ready!
                    logger.info(`${this._leafs.length} leaf(s) mounted from ${plugins_count} plugin(s):`);
                    logger.info(`   ${this._leaf_names.join(', ')}`);
                    resolve();
                });
            });
        });
    }

    /**
     * Get loaded leafs
     */
    get leafs(): MessageLeaf[] {
        return this._leafs;
    }

    /**
     * Get loaded plugins
     */
    get plugins(): Plugin[] {
        return this._plugins;
    }
}
