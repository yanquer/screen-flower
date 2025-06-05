
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

  // 是否允许使用ts-loader, 主要用于解决, babel 无法处理 @inject 注入
  useTsLoader: true,
  // ts-loader 是否允许编译 node_modules 里面的 ts
  allowTsInNodeModules: false,
}

