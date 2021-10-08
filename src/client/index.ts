import * as Cfx from "fivem-js"

on(`onClientResourceStart`, (resource: any) => {
    console.log("LOADEDx", new Date())
    console.log("WOW", resource)
})
