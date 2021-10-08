package main

import (
	"fmt"
	"syscall/js"

	cfx "github.com/normalM/citizenfx-go"
)

var (
	c  = make(chan bool)
	fn = js.FuncOf
	// Func = cfx.Global.
	// 	Call("exports").
	// 	Call("qb-core").
	// 	Call("GetCoreObject").
	// 	Call("Functions")
)

func init() {
	loadstr := fmt.Sprintf("wasm %s loaded.", cfx.Server.GetCurrentResourceName())
	cfx.Print(loadstr)
	cfx.TriggerClientEvent(
		"chat:addMessage",
		-1,
		loadstr,
	)
}
func main() {

	cfx.Server.RegisterCommand("test", fn(func(this js.Value, inputs []js.Value) interface{} {
		// // p := Func.Call("GetPlayer", inputs[0])

		cfx.TriggerClientEvent(
			"chat:addMessage",
			-1,
			"TEST!!",
		)
		cfx.Print("DO IT!!!!!!!")

		return nil
	}), false)

	<-c
}
