package main

import (
	"fmt"
	"syscall/js"
)

var global = js.Global()
var c = make(chan bool)

func main() {

	global.Call("RegisterCommand", "testc",
		js.FuncOf(funcx),
		false)

	println("wasm loaded")
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
