package handler

import (
	"fmt"
	"net/http"
)

func FindLink(w http.ResponseWriter, r *http.Request){
	if r.Method == http.MethodGet { 
			fmt.Fprintf(w, "GET request received\nYour link found") 
		  } 
}

func Shorten(w http.ResponseWriter, r *http.Request){
	if r.Method == http.MethodPost {
		fmt.Fprintf(w, "POST request recieved\nHere is your shortened link")
	}
}