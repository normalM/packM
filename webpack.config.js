const GoBuildWebpackPlugin = require("go-build-webpack-plugin").default
const webpack = require("webpack") // to access built-in plugins
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const WatchExternalFilesPlugin = require("webpack-watch-files-plugin").default
const exec = require("child-process-promise").exec
const path = require("path")

class WatchRunPlugin {
    apply(compiler) {
        compiler.hooks.done.tapPromise("WatchRun", async (comp) => {
            let result = await exec(
                `icecon -c "restart ${path.basename(
                    __dirname
                )}" localhost:30120 UC1dZ6mN72LFLyElhM`
            )
            console.log(result.stdout)
        })
    }
}
module.exports = (env) => {
    let goBuild = []
    let ent = {}
    if (!env["no-client"]) {
        ent["client"] = "./src/server/loader.ts"
        goBuild.push({
            env: { ...process.env, GOOS: "js", GOARCH: "wasm" },
            cwd: __dirname,
            outputPath: __dirname + "/dist/client/go.wasm",
            resourcePath: __dirname + "/src/client/",
            mode: "ignore",
        })
    }
    if (!env["no-server"]) {
        ent["server"] = "./src/server/loader.ts"
        goBuild.push({
            env: { ...process.env, GOOS: "js", GOARCH: "wasm" },
            cwd: __dirname,
            outputPath: __dirname + "/dist/server/go.wasm",
            resourcePath: __dirname + "/src/server/",
            mode: "ignore",
        })
    }
    return {
        mode: "production",
        entry: ent,
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: "ts-loader",
                    exclude: /node_modules/,
                    options: {},
                },
            ],
        },

        plugins: [
            new webpack.ProgressPlugin(),
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: ["**/*.js"],
            }),
            new GoBuildWebpackPlugin({
                inject: true,
                build: goBuild,
            }),
            new webpack.BannerPlugin({
                banner: "var __dirname = GetResourcePath(GetCurrentResourceName());\n",
                raw: true,
            }),
            new WatchExternalFilesPlugin({
                files: ["./src/**/*.ts", "./src/**/*.go"],
            }),
            new WatchRunPlugin(),
        ],
        optimization: {
            minimize: true,
        },
        resolve: {
            extensions: [".ts", ".js"],
        },
        target: "node",
        output: {
            filename: "[name]/[name]-[fullhash].js",
            path: __dirname + "/dist/",
        },
        //devtool: 'inline-source-map'
    }
}
