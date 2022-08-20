// const HTMLWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const path = require("path");

// @adi-g
// https://lannonbr.com/blog/2020-02-17-wasm-pack-webpack-plugin
// https://dev.to/lokesh007/webassembly-with-rust-and-react-using-create-react-app-67
module.exports = {
  entry: "./bootstrap.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bootstrap.js",
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
        {
          from: "../data/graph_data.json",
          to: "../data/graph_data.json"
        }
      ],
    }),
    new WasmPackPlugin({
      crateDirectory: path.join(__dirname, "../")
    })
  ],
  experiments: {
    syncWebAssembly: true, // deprecated, see https://github.com/webpack/webpack/issues/11347
  },
};