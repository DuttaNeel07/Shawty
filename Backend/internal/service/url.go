package service

import (
	"fmt"
	"io"
	"net/http"
)

func GetRoot(w http.ResponseWriter, r *http.Request){
	fmt.Printf("got / request\n")
	io.WriteString(w, "This is my website\n")
}

func GetHello(w http.ResponseWriter, r *http.Request){
	fmt.Printf("got / Hello Request\n")
	io.WriteString(w, "Hello, HTTP!\n")
}