package main

import "github.com/gopherjs/gopherjs/js"

var (
// Func = cfx.Global.
// 	Call("exports").
// 	Call("qb-core").
// 	Call("GetCoreObject").
// 	Call("Functions")
)

func init() {
	// loadstr := fmt.Sprintf("wasm %s loaded.", cfx.Server.GetCurrentResourceName())
	// cfx.Print(loadstr)
}
func main() {

	js.Global.Get("console").Call("log", "gopherjs load")
	// cfx.Server.RegisterCommand("test", fn(func(this js.Value, inputs []js.Value) interface{} {
	// 	// // p := Func.Call("GetPlayer", inputs[0])

	// 	cfx.TriggerClientEvent(
	// 		"chat:addMessage",
	// 		-1,
	// 		"TEST!!",
	// 	)
	// 	cfx.Print("DO IT!!!!!!!")

	// 	return nil
	// }), false)

}
