/**
 * Import required modules
 */
import fs from "fs";
import logger from "./lib/logger";
import RedisClient from "./lib/redis";
import ConfigDefault from "./lib/config-default";
import ConfigValidator from "./lib/config-validator";
import LotuServer from "./lotuserver";


/**
 * Declare Webpack Hot Reload
 */
type ModuleId = string | number;
interface WebpackHotModule {
  hot?: {
    data: any;
    accept(
      dependencies: string[],
      callback?: (updatedDependencies: ModuleId[]) => void,
    ): void;
    accept(dependency: string, callback?: () => void): void;
    accept(errHandler?: (err: Error) => void): void;
    dispose(callback: (data: any) => void): void;
  };
}
declare const module: WebpackHotModule;

logger.info("Welcome! We're opening lotus, please be patient...");


/**
 * Try to load configuration
 */
const config_filename = './src/lotuskit.config.json';
let config: any;
try {
  const rawconfig = fs.readFileSync(config_filename);
  config = JSON.parse(rawconfig.toString());
} catch (error) {
  logger.error(`Failed to load LotusKit configuration file.`);

  // Configuration file is not found
  if (error.code === 'ENOENT') {
    logger.error(`Please be sure ${config_filename} is in the app root folder.`);
  } else {
    logger.error(error);
  }
  
  process.exit(1);
}


/**
 * Validate configuration schema
 */
const configErrors = ConfigValidator.validate(config);
if (configErrors) {
  logger.error(`Error in configuration: ${configErrors}`);
  process.exit(1);
}


/**
 * Try to connect to Redis server
 */
const redis_connection_timeout = setTimeout(() => {
  logger.error(`Unable to open connection to Redis at ${config.redis_url}`);
  process.exit(1);
}, ConfigDefault.REDIS_CONNECTION_TIMEOUT_IN_MS);

let lotuserver: LotuServer;
RedisClient(config.redis_url).then(
  redis => {
    clearTimeout(redis_connection_timeout);

    // Start lotuskit server
    lotuserver = new LotuServer(config, redis);
  }
);


/**
 * Webpack Hot-Module Replacement Activation
 */
if (module.hot) {
  module.hot.accept();
  module.hot.dispose(async () => {
    // Stop lotuserver
    lotuserver.close();
  });
}
