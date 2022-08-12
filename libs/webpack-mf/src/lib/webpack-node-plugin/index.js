const CommonJsChunkLoadingPlugin = require('./CommonJsChunkLoadingPlugin');
const NodeEnvironmentPlugin = require('webpack/lib/node/NodeEnvironmentPlugin');
const NodeTargetPlugin = require('webpack/lib/node/NodeTargetPlugin');

class NodeAsyncHttpRuntime {
  constructor(options, context) {
    this.options = options || {};
    this.context = context || {};
  }

  apply(compiler) {
    if (compiler.options.target) {
      console.warn(
        `target should be set to false while using NodeAsyncHttpRuntime plugin, actual target: ${compiler.options.target}`
      );
    }

    // This will enable CommonJsChunkFormatPlugin
    compiler.options.output.chunkFormat = 'commonjs';
    // This will force async chunk loading
    compiler.options.output.chunkLoading = 'async-node';
    // Disable default config
    compiler.options.output.enabledChunkLoadingTypes = false;

    new NodeEnvironmentPlugin({
      infrastructureLogging: compiler.options.infrastructureLogging,
    }).apply(compiler);
    new NodeTargetPlugin().apply(compiler);
    new CommonJsChunkLoadingPlugin(
      {
        asyncChunkLoading: true,
        baseURI: compiler.options.output.publicPath,
        getBaseUri: this.options.getBaseUri,
      },
      this.context
    ).apply(compiler);
  }
}

module.exports = NodeAsyncHttpRuntime;
