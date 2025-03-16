const path = require("path")
const CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = {
    entry: {
        popup: "./src/popup.ts",
        background: "./src/background.ts",
        "pages/block-accountability/blockAccountability": "./src/pages/block-accountability/blockAccountability.ts",
        "pages/settings/settings": "./src/pages/settings/settings.ts",
        "pages/blocked-site/blockedSite": "./src/pages/blocked-site/blockedSite.ts"
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
    resolve: {
        extensions: ['.ts', '.js']
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