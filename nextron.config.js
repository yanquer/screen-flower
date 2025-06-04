
module.exports = {
  // specify an alternate main src directory, defaults to 'main'
  mainSrcDir: 'src/main',
  // specify an alternate renderer src directory, defaults to 'renderer'
  rendererSrcDir: 'src/renderer',

  // main process' webpack config
  webpack: (config, env) => {
    // do some stuff here
    return config
  },

  // 是否允许编译 node_modules
  allowTsInNodeModules: false,
}

