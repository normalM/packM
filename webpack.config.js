const GoBuildWebpackPlugin = require("go-build-webpack-plugin").default
const webpack = require("webpack") // to access built-in plugins
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const WatchExternalFilesPlugin = require("webpack-watch-files-plugin").default
const exec = require("child-process-promise").exec
const path = require("path")
const WebpackObfuscator = require("webpack-obfuscator")
const cfg = require("./package.json")
let config = {
    cache: false,
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },

    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },

    resolve: {
        extensions: [".ts", ".js"],
        // fallback: { util: require.resolve("util") },
    },
    target: ["node"],

    //devtool: 'inline-source-map'
}
class WatchRunPlugin {
    apply(compiler) {
        compiler.hooks.done.tapPromise("WatchRun", async (comp) => {
            if (!cfg.rcon.autorestart) return
            console.log("\n====================")
            let result = await exec(
                `${path.join(
                    __dirname,
                    `/bin/icecon_${process.platform}_amd64`
                )} -c "restart ${path.basename(__dirname)}" ${cfg.rcon.addr} ${
                    cfg.rcon.password
                }`
            )
            console.log(result.stdout, "====================")
        })
    }
}
module.exports = (env, argv) => {
    config.mode = argv.mode == "production" ? "production" : "development"

    let goBuild = []
    config.entry = {}
    config.plugins = [
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ["**/*.js", "**/*.txt"],
        }),
        // new webpack.DefinePlugin({
        //     "process.env.NODE_DEBUG": JSON.stringify(process.env.DEBUG),
        //     "global.GENTLY": false,
        //     // "process.env.DEBUG": JSON.stringify(process.env.DEBUG),
        // }),
        new webpack.BannerPlugin({
            include: "server",
            banner: "var __dirname = GetResourcePath(GetCurrentResourceName());\n",
            raw: true,
        }),
        new WatchExternalFilesPlugin({
            files: ["./src/**/*.ts", "./src/**/*.go"],
        }),
        new WatchRunPlugin(),
    ]
    if (!env["no-client"]) {
        config.entry["client"] = "./src/client/index.ts"
        // goBuild.push({
        //     env: { ...process.env, GOOS: "js", GOARCH: "wasm" },
        //     cwd: __dirname,
        //     outputPath: __dirname + "/dist/client/go.wasm",
        //     resourcePath: __dirname + "/src/client/",
        //     mode: "ignore",
        // })
    }
    if (!env["no-server"]) {
        config.entry["server"] = "./src/server/loader.ts"
        goBuild.push({
            env: { ...process.env, GOOS: "js", GOARCH: "wasm" },
            cwd: __dirname,
            outputPath: __dirname + "/dist/server/go.wasm",
            resourcePath: __dirname + "/src/server/",
            mode: "ignore",
        })
    }
    if (goBuild.length > 0) {
        config.plugins.push(
            new GoBuildWebpackPlugin({
                inject: true,
                build: goBuild,
            })
        )
    }

    if (argv.mode === "development") {
    }

    if (argv.mode === "production") {
        config.plugins.push(
            new WebpackObfuscator(
                { rotateStringArray: true, reservedStrings: ["s*"] },
                []
            )
        )
    }
    config.optimization = {
        minimize: argv.mode === "production" ? true : false,
        moduleIds: argv.mode === "production" ? "deterministic" : "named",
    }
    config.output = {
        filename:
            argv.mode === "production"
                ? "[name]/[name].[fullhash].js"
                : "[name]/[name].js",
        path: __dirname + "/dist/",
    }
    return config
}
