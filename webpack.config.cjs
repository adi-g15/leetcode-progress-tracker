// const HTMLWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

// @adi-g
// https://lannonbr.com/blog/2020-02-17-wasm-pack-webpack-plugin
// https://dev.to/lokesh007/webassembly-with-rust-and-react-using-create-react-app-67
module.exports = {
  entry: "./index.ts",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts",".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "development",
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "index.html",
        },
        {
          from: "global.css",
        },
      ],
    }),
  ],
};

// ex: shiftwidth=2 expandtab:
