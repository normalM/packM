import { Load } from "wasm_exec-ts"
try {
    await Load(`${__dirname}/dist/server/go.wasm`)
} catch (error) {
    console.log(error)
}
