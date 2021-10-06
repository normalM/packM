package main

import (
	"fmt"
	"syscall/js"
)

var global = js.Global()
var c = make(chan bool)
var cfx cfxClass

func init() {

	global.Call("GetCurrentResourceName")
}
func main() {

	global.Call("RegisterCommand", "tc",
		js.FuncOf(funcx),
		false)

	println("[]wasm loaded")
	<-c
}

func funcx(this js.Value, inputs []js.Value) interface{} {

	global.Call("TriggerClientEvent",
		"chat:addMessage",
		js.ValueOf(-1),
		inputs[1].JSValue(),
	)
	println("DO!!!!!!!")
	println(fmt.Sprintln(inputs[1]))

	return nil
}