const path = require('path');

module.exports = {
  mode:process.env.NODE_ENV || 'development',
  entry: path.join(__dirname,'./src/index.js'),
  output: {
    path: path.join(__dirname, './dist/'),
    filename:'index.js',
    library: '',
    libraryTarget: 'commonjs2',
    libraryExport: 'default'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};