package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"syscall/js"
)

var global = js.Global()
var c = make(chan bool)

func main() {

	resp, err := http.Get("https://jsonplaceholder.typicode.com/posts")
	if err != nil {
		log.Fatalln(err)
	}
	//We Read the response body on the line below.
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}
	//Convert the body to type string
	sb := string(body)
	global.Call("RegisterCommand", "tc",
		js.FuncOf(funcx),
		false)

	println("wasm loaded", sb)
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
