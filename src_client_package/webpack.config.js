const path = require('path');

module.exports = {
  entry: {
    main: path.resolve(__dirname, 'src', 'index.js')
  },
  output: {
    path: path.resolve('../', 'client_packages'),
    filename: 'main.js'
  },
  performance: {
    hints: false
  },
  module: {
    noParse: /nativeui/,
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
            loader: '@sucrase/webpack-loader',
            options: {
                transforms: ['imports']
            }
        }
      }
    ]
  }
};
