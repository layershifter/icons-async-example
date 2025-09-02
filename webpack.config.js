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
          }
      ]
    },
  resolve: {
    extensions: ['.js'],
  },
    optimization: {
        minimize: false,
    }
};
