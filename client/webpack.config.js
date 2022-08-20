// const HTMLWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

// @adi-g
// https://lannonbr.com/blog/2020-02-17-wasm-pack-webpack-plugin
// https://dev.to/lokesh007/webassembly-with-rust-and-react-using-create-react-app-67
module.exports = {
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
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
          from: "../records.json",
          to: "../records.json"
        }
      ],
    }),
  ],
};

// ex: shiftwidth=2 expandtab:
