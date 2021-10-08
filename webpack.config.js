const webpack = require("webpack") // to access built-in plugins
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const WatchExternalFilesPlugin = require("webpack-watch-files-plugin").default
const exec = require("child-process-promise").exec
const path = require("path")
const WebpackObfuscator = require("webpack-obfuscator")
const process = require("process")
const packm = require("./packm.json")
const ensureArray = (config) =>
    (config && (Array.isArray(config) ? config : [config])) || []
const whenA = (condition, config, negativeConfig) =>
    condition ? ensureArray(config) : ensureArray(negativeConfig)
const ensureObject = (config) =>
    (config && (typeof config === "object" ? config : { config })) || {}
const whenO = (condition, config, negativeConfig) =>
    condition ? ensureObject(config) : ensureObject(negativeConfig)
class WatchRunPlugin {
    constructor(gobuild, rcon) {
        this.gobuild = gobuild
        this.rcon = rcon
    }
    apply(compiler) {
        compiler.hooks.done.tap("WatchRun", async (comp) => {
            await this.buildGO()
            if (!this.rcon.autorestart) return
            let result = await exec(
                `${path.join(
                    __dirname,
                    `/bin/icecon_${process.platform}_amd64`
                )} -c "restart ${path.basename(__dirname)}" ${this.rcon.addr} ${
                    this.rcon.password
                }`
            )
            console.log("\n", result.stdout)
        })
        compiler.hooks.beforeRun.tap(
            "GoBuildWebpackPlugin",
            (compilation, cb) => {
                this.buildGO().then()
            }
        )
    }
    async buildGO() {
        if (this.gobuild.length == 0) return
        for (const b of this.gobuild) {
            try {
                if (b.exec) {
                    await exec(b.exec, {
                        cwd: b.cwd || "",
                        env: b.env,
                    })
                } else {
                    await exec(
                        `go build -o ${path.resolve(
                            b.outputPath
                        )} ${path.resolve(b.resourcePath)}`,
                        {
                            cwd: b.cwd || "",
                            env: b.env,
                        }
                    )
                }
            } catch (error) {
                return error
            }
        }
    }
}

module.exports = {
    mode: process.env.mode == "production" ? "production" : "development",
    entry: {
        ...whenO(packm.server.typescript.enable, {
            server: packm.server.typescript.main,
        }),
        ...whenO(packm.client.typescript.enable, {
            client: packm.client.typescript.main,
        }),
        ...whenO(packm.shared.typescript.enable, {
            shared: packm.shared.typescript.main,
        }),
    },
    cache: packm.webpack.cache,
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ["**/*.js", "**/*.txt"],
        }),
        new WatchExternalFilesPlugin({
            files: ["./src/**/*.js", "./src/**/*.ts", "./src/**/*.go"],
        }),
        new WatchRunPlugin(
            [
                ...whenA(packm.server.go.enable, {
                    env: { ...process.env, GOOS: "js", GOARCH: "wasm" },
                    cwd: __dirname,
                    outputPath: __dirname + "/dist/server/go.wasm",
                    resourcePath: __dirname + "/src/server/",
                }),
                ...whenA(packm.client.go.enable, {
                    env: process.env,
                    cwd: __dirname,
                    exec: packm.client.go.exec,
                }),
            ],
            packm.rcon
        ),
        ...whenA(
            process.env.mode == "production",
            new WebpackObfuscator(
                { rotateStringArray: true, reservedStrings: ["s*"] },
                []
            )
        ),
    ],
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
    optimization: {
        minimize: process.env.mode === "production" ? true : false,
        moduleIds:
            process.env.mode === "production" ? "deterministic" : "named",
    },
    output: {
        filename:
            process.env.mode === "production"
                ? "[name]/[name].[fullhash].js"
                : "[name]/[name].js",
        path: __dirname + "/dist/",
    },
}
