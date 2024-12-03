const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const dotenv = require('dotenv').config({ path: __dirname + '/.env' })
const isDevelopment = process.env.NODE_ENV !== 'production'

module.exports = {
  entry: path.join(__dirname, 'src', 'index.tsx'),
  output: {
    publicPath: '/',
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@providers': path.resolve(__dirname, 'src/providers'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@interfaces': path.resolve(__dirname, 'src/interfaces'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@redux': path.resolve(__dirname, 'src/redux'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@generated': path.resolve(__dirname, 'src/generated'),
      '@routes': path.resolve(__dirname, 'src/routes'),
    },
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenv.parsed),
      'process.env.NODE_ENV': JSON.stringify(
        isDevelopment ? 'development' : 'production',
      ),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },

      {
        test: /\.s[ac]ss|css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: { sourceMap: true },
          },
        ],
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 3000,
    hot: true,
    liveReload: true,
    historyApiFallback: true,
  },
}
