#!/usr/bin/env node

const chalk = require('chalk');
const { program } = require('commander');
const { install } = require('pkg-install');
const fs = require('fs');

// Read config
const config_filename = './lotuskit.config.json';
let server_config;
try {
    server_config = JSON.parse(fs.readFileSync(config_filename).toString());
} catch (error) {
    console.log(chalk.red(`Not a LotusKit server:\n Unable to load configuration file (${config_filename}) `));
    process.exit(1);
}

program.version('0.0.1')

program
  .command('plugins').alias('p')
  .description('display installed plugins')
  .action(async function (plugin, otherPlugins) {
    console.log(chalk.underline('Installed plugins:'));
    for (const plugin in server_config.plugins) {
        console.log(`- ${plugin}`);
    }
});

program
    .command('install <plugin>')
    .alias('i')
    .description('install new LotusKit plugins')
    .action(async function (plugin) {
        console.log(`Installing ${plugin} plugin...`);

        // Install plugin
        pkginstall(plugin).then(
            (result) => {
                // OK
                console.log(result.stdout);
                console.log("Updating configuration...");

                if (!server_config.plugins[plugin]) {
                    server_config.plugins[plugin] = {}
                }
                saveConfig();

                console.log(chalk.green(`${plugin} plugin installed successfully!`));
            },
            (error) => {
                // Failed
                console.log(chalk.bgRed('Failed to install plugin!'));
                console.log(chalk.red(error));
                process.exit(1);
            }
        )
});
 
program.parse(process.argv);

function saveConfig() {
    // Write config
    fs.writeFileSync(config_filename, JSON.stringify(server_config, null, 4));
}

function pkginstall(package) {
    const pkgs = {};
    pkgs[package] = undefined;
    return new Promise((resolve, reject) => {
        install(pkgs).then(
            (installResult) => {
                resolve(installResult);
            }
        ).catch(
            (error) => {
                reject(error);
            }
        )
    });
}