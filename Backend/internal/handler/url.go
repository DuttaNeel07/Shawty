package handler

import (
	"fmt"
	"net/http"

	"github.com/DuttaNeel07/Shawty/internal/service"
)

func FindLink(w http.ResponseWriter, r *http.Request){
	if r.Method == http.MethodGet { 
			fmt.Fprintf(w, "GET request received\nYour link found") 
		  } 
}

func Shorten(w http.ResponseWriter, r *http.Request){
	if r.Method == http.MethodPost {
		link := r.URL.Query().Get("link")
		response := service.CreateHash(link)
		fmt.Fprintf(w, response)
	}
}