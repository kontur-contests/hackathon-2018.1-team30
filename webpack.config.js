const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackExternalsPlugin = require("html-webpack-externals-plugin");

const isDev = process.env.NODE_ENV !== "production";

const plugins = isDev
  ? [
      new CopyWebpackPlugin([path.resolve(__dirname, "public")]),
      new HtmlWebPackPlugin({
        title: "Excalibur Webpack Sample"
      })
    ]
  : [
      new CleanWebpackPlugin(["dist"]),
      new CopyWebpackPlugin([path.resolve(__dirname, "public")]),
      new HtmlWebPackPlugin({
        title: "Excalibur Webpack Sample"
      }),
      new HtmlWebpackExternalsPlugin({
        externals: [
          {
            module: "excalibur",
            entry: "dist/excalibur.min.js",
            global: "ex"
          }
        ]
      })
    ];

module.exports = {
  entry: {
    game: "./src/index.ts"
  },
  externals: isDev
    ? {}
    : {
        excalibur: "excalibur"
      },
  devtool: isDev ? "inline-source-map" : "source-map",
  devServer: {
    contentBase: "./dist"
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  },
  plugins
};
