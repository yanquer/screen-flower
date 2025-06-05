
const {join} = require("path");


// 支持 node_modules 的 css
const withTM = require('next-transpile-modules')([
  // '@patternfly/react-core',
  // '@patternfly/react-styles',
  // '@patternfly/react-log-viewer',
  '@yanquer/common',
]);
// withTM2 暂时取消效果
const withTM2 = (data) => data


/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: process.env.NODE_ENV === 'production' ? '../../app' : '.next',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    // config.module.rules.push({
    //   test: /\.scss$/,
    //   use: [
    //     "style-loader",
    //     "css-loader",
    //     "sass-loader"
    //   ],
    // });

    // 解决默认的加载器不识别 const bindToDefaultContainer = <T>(arg: T){} 这种泛型语法
    config.module.rules.push({ test: /\.([cm]?ts|tsx)$/, loader: "ts-loader" ,
      options: {
        // node_modules 编译
        // allowTsInNodeModules: true,
      }})

    return config
  },
  sassOptions: {
    includePaths: [
      join(__dirname, 'public', 'styles'),
    ],
  },
}

/** @type {import('next').NextConfig} */
module.exports = withTM2(nextConfig)

