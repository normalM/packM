package main

import "github.com/gopherjs/gopherjs/js"

func main() {
	js.Global.Get("console").Call("log", "gopherjs load")

}
