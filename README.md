# LotusKit Chat
![Image of Yaktocat](lotuskit.png)  
A programmable turnkey chat server, flexible and open-source

## Install dev environment
1. Install Node.js on your computer
2. Install packages: `npm install`
3. Fetch `.env` file or copy `.env.sample` to `.env` and fill it

## Start development server
1. Open terminal and run webpack: `npm run webpack`
2. Open another terminal (or Split in VisualStudioCode), and start server: `npm start`

## Used packages
`express`: Fast, unopinionated, minimalist web framework for Node.js.  
`dotenv`: Zero-dependency module that loads environment variables from a .env file into process.env.  
`redis`: Caching and storage for chat messages.  
`socket.io`: WebSockets tool for communication between client and server.  
`helmet`: Express middleware to secure your apps by setting various HTTP headers, which mitigate common attack vectors.  
`bluebird`: Promisify redis.  
`typescript`: Use types into node.js  
`ts-loader`: A TypeScript loader for webpack, which helps preprocess TypeScript files to create a JavaScript bundle.  
`webpack`: A module bundler, which is capable of transforming, bundling, or packaging just about any resource or asset.  
`webpack-cli`: A module that provides a flexible set of commands for developers to increase speed when setting up a custom webpack project.  
`webpack-node-externals`: A module to easily exclude Node.js modules from a webpack bundle.  
`log4js`: Logging tool to mannage logging levels, timestamping and storage into files.  
`jest`: Testing framework developed by Facebook. It works out of the box with minimal configuration and has in-built test runner, assertion library and mocking support.
`supertest`: Library for testing Node.js HTTP servers. It enables us to programmatically send HTTP requests such as GET, POST, PATCH, PUT, DELETE to HTTP servers and get results.
`ajv`: JSON schema validator for config.json

## Documentation
https://manifold.co/blog/building-a-chat-room-in-30-minutes-using-redis-socket-io-and-express-9e8e5a578675
https://github.com/dwyl/hapi-socketio-redis-chat-example