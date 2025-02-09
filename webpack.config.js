const path = require("path")
const CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = {
    entry: {
        popup: "./src/popup.js",
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist")   
    },
    mode: "production",
    watch: true,
    plugins: [
        new CopyWebpackPlugin({
            patterns: [{ from: "static" }]
        })
    ]
}