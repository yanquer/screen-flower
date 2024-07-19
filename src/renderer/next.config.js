
const {join} = require("path");


/** @type {import('next').NextConfig} */
module.exports = {
  output: 'export',
  distDir: process.env.NODE_ENV === 'production' ? '../app' : '.next',
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

    // required to make Konva & react-konva work
    config.externals = [...config.externals, { canvas: 'canvas' }];

    return config
  },
  sassOptions: {
    includePaths: [
        join(__dirname, 'public', 'styles'),
    ],
  },
}
