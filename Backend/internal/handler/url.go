package handler

import (
	"fmt"
	"net/http"

	"github.com/DuttaNeel07/Shawty/internal/service"
)

func FindLink(w http.ResponseWriter, r *http.Request){
	//var slug := r.PathValue("slug")

}

func Shorten(w http.ResponseWriter, r *http.Request){
	slug := r.PathValue("slug")

	


}