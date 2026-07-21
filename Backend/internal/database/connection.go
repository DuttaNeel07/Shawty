package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)


func init() {
    // loads values from .env into the system
    if err := godotenv.Load(); err != nil {
        log.Print("No .env file found")
    }
}

func ConnectDB() {
	PostgresString := os.Getenv("POSTGRESCONNSTRING")
	db, err := sql.Open("pgx", PostgresString)

	if err != nil{
		fmt.Printf("Error in connecting to db\n%v", err)
	}
	if err := db.PingContext(ctx); err != nil {
		fmt.Printf("Unexpected error!\n%v",err)
	  }
}