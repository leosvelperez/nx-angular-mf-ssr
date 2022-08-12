module.exports = {
  name: 'shell',
  remotes: [],
  // TODO: remove when webpack-mf is ready
  shared: (library, config) =>
    library !== '@tusk/module-federation' ? config : false,
};
