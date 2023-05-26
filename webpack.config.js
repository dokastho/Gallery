const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    account: './gallery/js/account.jsx',
    delete: './gallery/js/delete.jsx',
    create: './gallery/js/create.jsx',
    index: './gallery/js/index.jsx',
    login: './gallery/js/login.jsx',
    password: './gallery/js/password.jsx',
  },
  output: {
    path: path.join(__dirname, '/gallery/static/js/'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        // Test for js or jsx files
        test: /\.jsx?$/,
        // Exclude external modules from loader tests
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: ['@babel/transform-runtime'],
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
