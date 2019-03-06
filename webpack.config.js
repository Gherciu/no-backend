const path = require("path");

module.exports = {
    target: "node",
    mode: "none",
    entry: ["@babel/polyfill", path.join(__dirname, "./src/index.js")],
    output: {
        path: path.join(__dirname, "./dist/"),
        filename: "index.js",
        library: "",
        libraryTarget: "commonjs2",
        libraryExport: "default"
    },
    externals: {
        graphql: "graphql"
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    }
};
