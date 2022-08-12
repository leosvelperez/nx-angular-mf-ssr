const { withModuleFederation } = require('@tusk/webpack-mf');
const config = require('./module-federation.config');

module.exports = withModuleFederation(config);
