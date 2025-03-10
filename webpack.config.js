const path = require("path")
const CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = {
    entry: {
        popup: "./src/popup.ts",
        background: "./src/background.ts",
        "pages/blockAccountability/blockAccountability": "./src/pages/blockAccountability/blockAccountability.ts",
        "pages/settings/settings": "./src/pages/settings/settings.ts"
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