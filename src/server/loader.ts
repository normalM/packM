//@ts-ignore
import { Load } from "wasm_exec-ts"
;(async () => {
    try {
        await Load(`${__dirname}/dist/server/go.wasm`)
    } catch (error) {
        console.log(error)
    }
})()
