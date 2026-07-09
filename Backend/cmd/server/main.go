package main

import (
	"errors"
	"fmt"
	"net/http"
	"os"
	"github.com/DuttaNeel07/Shawty/internal/service"
)

func main(){
	http.HandleFunc("/", service.GetRoot)
	http.HandleFunc("/hello", service.GetHello)

	err:= http.ListenAndServe(":8000", nil)
	if errors.Is(err, http.ErrServerClosed) {
        fmt.Printf("server closed\n")
    } else if err != nil {
        fmt.Printf("error starting server: %s\n", err)
        os.Exit(1)
}
}
