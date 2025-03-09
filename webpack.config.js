const path = require("path")
const CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = {
    entry: {
        popup: "./src/popup.js",
        background: "./src/background.ts",
        "pages/blockAccountability/blockAccountability": "./src/pages/blockAccountability/blockAccountability.js",
        "pages/settings/settings": "./src/pages/settings/settings.js"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
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