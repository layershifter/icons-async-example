const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
        filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
      pathinfo: true,
  },
    module: {
      rules: [
          {
                test: /\.js$/,
              include: /react-icons/,
                loader: path.resolve(__dirname, 'icon-split-loader.js'),
          },
          {
                test: /\/chunk-[^\/]+\/[^\/]+\.js$/,
                loader: path.resolve(__dirname, 'icon-split-loader.js'),
          }
      ]
    },
  resolve: {
    extensions: ['.js'],
  },
    optimization: {
        minimize: false,
    //     splitChunks: {
    //         chunks: 'async',
    //         cacheGroups: {
    //             defaultVendors: {
    //                 test: /[\\/]react-icons[\\/]/,
    //                 minChunks: 1,
    //                 reuseExistingChunk: false,
    //                 chunks: 'all',
    //             },
    //             // default: {
    //             //     minChunks: 1,
    //             //     chunks: 'all',
    //             //     reuseExistingChunk: true,
    //             // },
    //         },
    //     },
    }
};
