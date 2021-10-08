module.exports = {
    webpack: {
        mode: "production",
        cache: false,
        filename: {
            production: "[name].[fullhash].js",
            development: "[name].js",
        },
    },
    rcon: {
        addr: "localhost:30120",
        password: "UC1dZ6mN72LFLyElhM",
        autorestart: true,
    },
    server: {
        go: {
            enable: true,
        },
        typescript: {
            enable: true,
            main: "./src/server/loader.ts",
        },
    },
    client: {
        go: {
            enable: false,
            exec: "docker-compose up -d",
        },
        typescript: {
            enable: true,
            main: "./src/client/index.ts",
        },
    },
    shared: {
        typescript: {
            enable: false,
            main: "./src/shared/index.ts",
        },
    },
}
