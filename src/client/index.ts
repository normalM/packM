import * as Cfx from "fivem-js"

RegisterCommand(
    "adder",
    async (source: number, args: string[]) => {
        const vehicle = await Cfx.World.createVehicle(
            new Cfx.Model("adder"),
            new Cfx.Vector3(1, 2, 3),
            4
        )
        Cfx.Game.PlayerPed.setIntoVehicle(vehicle, Cfx.VehicleSeat.Driver)
    },
    false
)

on(`onClientResourceStart`, (resource: any) => {
    console.log("LOADEDx", new Date())
    console.log("WOW", resource)
})