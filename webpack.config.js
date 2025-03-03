const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        popup: "./src/popup.js",
        background: "./src/background.js",
        settings: "./static/extension-pages/settings/settings.js", // Process settings.js
        "block-accountability": "./static/extension-pages/block-accountability/block-accountability.js"
    },
    output: {
        filename: (pathData) => {
            return (pathData.chunk.name !== "popup" && pathData.chunk.name !== "background")
                ? `extension-pages/${pathData.chunk.name}/${pathData.chunk.name}.js` // Keep settings.js in the correct folder
                : "[name].js";
        },
        path: path.resolve(__dirname, "dist")
    },
    mode: "production",
    watch: true,
    resolve: {
        modules: [path.resolve(__dirname, "src"), "node_modules"], // Allow imports from src
        alias: {
            "@helpers": path.resolve(__dirname, "src/helper-functions") // Shortcut for helper imports
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, "src"),   // Process src JS files
                    path.resolve(__dirname, "static/extension-pages/settings"), // Process settings.js
                    path.resolve(__dirname, "static/extension-pages/block-accountability") // Process block-accountability.js
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
                    to: "extension-pages" // Copies everything inside static/extension-pages to dist/extension-pages
                },
                {
                    from: "static", 
                    to: ".", // Copy everything inside static but place directly into dist/ (no "static" folder)
                    globOptions: {
                        ignore: ["extension-pages/**"] // Prevents double copying of extension-pages
                    }
                }
            ]
        })
    ]
};
