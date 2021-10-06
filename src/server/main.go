package main

import (
	"syscall/js"
)

var global = js.Global()
var c = make(chan bool)

func init() {

	global.Call("GetCurrentResourceName")
}
func main() {

	global.Call("RegisterCommand", "tc",
		js.FuncOf(funcx),
		false)

	print("wasm loaded.")
	<-c
}

func funcx(this js.Value, inputs []js.Value) interface{} {

	global.Call("TriggerClientEvent",
		"chat:addMessage",
		js.ValueOf(-1),
		inputs[1].JSValue(),
	)
	print("DO!!!!!!!")
	// println(fmt.Sprintln(inputs[1]))

	return nil
}

func print(arg ...interface{}) {

	global.Get("console").Call("log", arg...)
}
