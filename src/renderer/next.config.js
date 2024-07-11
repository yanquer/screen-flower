
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
    return config
  },
  sassOptions: {
    includePaths: [
        join(__dirname, 'public', 'styles'),
    ],
  },
}
