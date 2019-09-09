const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: {
        app: "./src/js/game.js"
    }, 
    output: {
        path: path.join(__dirname, "./public/"),
        filename: "[name].bundle.js",
    },
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        port: 9000
    },
    module: {
        rules: [
            {
              test: /\.js$/,
              exclude: /(node_modules)/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: ["@babel/preset-env"]
                }
              }
            }
          ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'src/index.ejs'
      }),
      new CopyPlugin([
        { from: 'src/sprites', to: 'sprites' }
      ])
    ],
    mode: 'development',
    devtool: 'inline-source-map'
}