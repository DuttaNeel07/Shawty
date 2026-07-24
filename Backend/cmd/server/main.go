package main

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/DuttaNeel07/Shawty/internal/database"
	"github.com/DuttaNeel07/Shawty/internal/handler"
)

func main(){

	if err := database.ConnectDB(); err != nil{
		log.Fatalf("Failed to connect to db %v", err)
	} 
	defer database.DB.Close()

	http.HandleFunc("/{slug}", handler.FindLink)
	http.HandleFunc("/shorten/{link}", handler.Shorten)
	//http.HandleFunc("/books",)


	err:= http.ListenAndServe(":8000", nil)
	if errors.Is(err, http.ErrServerClosed) {
        fmt.Printf("server closed\n")
    } else if err != nil {
        fmt.Printf("error starting server: %s\n", err)
        os.Exit(1)
}
}
