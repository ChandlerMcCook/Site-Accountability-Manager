const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        popup: "./src/popup.js",
        background: "./src/background.js",
        settings: "./static/extension-pages/settings/settings.js", 
        "block-accountability": "./static/extension-pages/block-accountability/block-accountability.js"
    },
    output: {
        filename: (pathData) => {
            return (pathData.chunk.name !== "popup" && pathData.chunk.name !== "background")
                ? `extension-pages/${pathData.chunk.name}/${pathData.chunk.name}.js` 
                : "[name].js";
        },
        path: path.resolve(__dirname, "dist")
    },
    mode: "production",
    watch: true,
    resolve: {
        modules: [path.resolve(__dirname, "src"), "node_modules"], 
        alias: {
            "@helpers": path.resolve(__dirname, "src/helper-functions") 
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, "src"),
                    path.resolve(__dirname, "static/extension-pages/settings"),
                    path.resolve(__dirname, "static/extension-pages/block-accountability")
                ],
                use: "babel-loader"
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.html$/,
                use: "html-loader"
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: "static/extension-pages", 
                    to: "extension-pages"
                },
                {
                    from: "static", 
                    to: ".",
                    globOptions: {
                        ignore: ["extension-pages/**"]
                    }
                }
            ]
        })
    ]
};
