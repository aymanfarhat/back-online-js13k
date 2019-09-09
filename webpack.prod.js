
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');


module.exports = {
    entry: {
        app: "./src/js/game.js"
    }, 
    output: {
        path: path.join(__dirname, "./dist/"),
        filename: "[name].bundle.js",
    },
    module: {
        rules: [
            {
              test: /\.js$/,
              exclude: /(node_modules)/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: [["@babel/preset-env", {"targets": "> 0.25%, not IE 11"}]]
                }
              }
            }
          ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'src/index.ejs',
        inlineSource: '.(js|css)$',
        minify: {
            collapseWhitespace: true
        }
      }),
      new HtmlWebpackInlineSourcePlugin(),
      new CopyPlugin([
        { from: 'src/sprites', to: 'sprites' }
      ])
    ],
    optimization: {
        minimizer: [new UglifyJsPlugin({
            uglifyOptions: {
                output: {
                  comments: false
                }
              }
        }
        )],
        namedModules: false,
        namedChunks: false,
        nodeEnv: 'production',
        flagIncludedChunks: true,
        occurrenceOrder: true,
        sideEffects: true,
        usedExports: true,
        concatenateModules: true,
        noEmitOnErrors: true,
        checkWasmTypes: true,
        minimize: true,
    },
    mode: 'production'
}