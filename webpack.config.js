const path = require('path');

module.exports = {
  mode:'development',
  entry: path.join(__dirname,'./src/common/graphiQl/index.jsx'),
  output: {
    path: path.join(__dirname, './dist/common/graphiQl'),
    filename:'index.jsx',
  },
  module: {
    rules: [
      {
        test: /\.(flow|graphql)$/,
        use:{
          loader: 'ignore-loader'
        }
      },
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
          test: /\.css$/,
          use: [
              "style-loader", // creates style nodes from JS strings
              "css-loader", // translates CSS into CommonJS
          ]
      }
    ]
  }
};
