
const {join} = require("path");


/** @type {import('next').NextConfig} */
module.exports = {
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
    config.module.rules.push({ test: /\.([cm]?ts|tsx)$/, loader: "ts-loader" })

    return config
  },
  sassOptions: {
    includePaths: [
        join(__dirname, 'public', 'styles'),
    ],
  },
}
