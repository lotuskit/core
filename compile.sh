# Delete previous compilation
rm -rf dist
mkdir dist

# Copy webpacked app
cp package.json dist/package.json
cp package-lock.json dist/package-lock.json
cp build/lotuskit.js dist/lotuskit.js

# Copy views & static resources
mkdir dist/src
cp -R src/public dist/src/public
mkdir dist/src/webui
cp -R src/webui/views dist/src/webui/views

# Copy plugin resolver (Architect config)
cp plugin-resolver.js dist/plugin-resolver.js

# Create empty dirs
mkdir dist/log
mkdir dist/plugins

# Copy default config
cp lotuskit.config.default.json dist/lotuskit.config.json