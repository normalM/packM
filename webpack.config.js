const webpack = require("webpack") // to access built-in plugins
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const WatchExternalFilesPlugin = require("webpack-watch-files-plugin").default
const exec = require("child-process-promise").exec
const path = require("path")
const WebpackObfuscator = require("webpack-obfuscator")
const process = require("process")

// const WebpackBundleAnalyzer = require("webpack-bundle-analyzer")

const cfg = require("./package.json")
let goBuild = []
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
    experiments: {
        topLevelAwait: true,
    },
    //devtool: 'inline-source-map'
}
class WatchRunPlugin {
    apply(compiler) {
        compiler.hooks.done.tap("WatchRun", async (comp) => {
            // console.log(new Date())
            await BuildGO()
            // console.log(new Date())
            if (!cfg.rcon.autorestart) return
            let result = await exec(
                `${path.join(
                    __dirname,
                    `/bin/icecon_${process.platform}_amd64`
                )} -c "restart ${path.basename(__dirname)}" ${cfg.rcon.addr} ${
                    cfg.rcon.password
                }`
            )
            console.log("\n", result.stdout)
        })
        compiler.hooks.beforeRun.tap(
            "GoBuildWebpackPlugin",
            (compilation, cb) => {
                if (goBuild.length == 0) return cb()
                BuildGO().catch((err) => {
                    return cb(err)
                })
                cb()
            }
        )
        // compiler.hooks.watchRun.tapPromise(
        //     "GoBuildWebpackPlugin",
        //     async (compilation) => {
        //         try {
        //             await BuildGO()
        //         } catch (error) {
        //             console.log(error)
        //         }
        //     }
        // )
    }
}
const BuildGO = async () => {
    for (const b of goBuild) {
        console.log("GO", new Date())

        let cmd = `go build -o ${path.resolve(b.outputPath)} ${path.resolve(
            b.resourcePath
        )}` // Can be a go file or a package
        try {
            await exec(cmd, {
                cwd: process.cwd() || "",
                env: b.env,
            })
        } catch (error) {
            return error
        }
        console.log("G2O", new Date())
    }
}
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}
module.exports = (env, argv) => {
    config.mode = argv.mode == "production" ? "production" : "development"

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

    if (!env["no-shared"]) {
        config.entry["shared"] = "./src/shared/index.ts"
    }
    if (!env["no-client"]) {
        config.entry["client"] = "./src/client/index.ts"
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
    // if (goBuild.length > 0) {
    //     config.plugins.push(
    //         new GoBuildWebpackPlugin({
    //             inject: true,
    //             build: goBuild,
    //         })
    //     )
    // }

    if (argv.mode === "development") {
    }

    if (argv.mode === "production") {
        config.plugins.push(
            new WebpackObfuscator(
                { rotateStringArray: true, reservedStrings: ["s*"] },
                []
            )
        )
        // config.plugins.push(new WebpackBundleAnalyzer.BundleAnalyzerPlugin())
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
