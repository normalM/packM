import { Load } from "wasm_exec-ts"
try {
    await Load(
        `${GetResourcePath(GetCurrentResourceName())}/dist/server/go.wasm`
    )
} catch (error) {
    console.error(error)
}
console.log("OHOH")
