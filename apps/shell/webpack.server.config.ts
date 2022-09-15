import { withModuleFederationSsr } from '@tusk/webpack-mf';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('./module-federation.server.config');

export default withModuleFederationSsr(config);
