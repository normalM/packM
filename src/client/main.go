package main

import (
	"fmt"
	"syscall/js"
)

func main() {
	global := js.Global().Get("global")
	global.Call("RegisterCommand", "testc",
		func() {
			fmt.Println("Hi")
		},
		false)

}
