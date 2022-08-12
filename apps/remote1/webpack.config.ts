import { withModuleFederation } from '@tusk/webpack-mf';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('./module-federation.config');

module.exports = withModuleFederation(config);
