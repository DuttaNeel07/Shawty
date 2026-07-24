package database

import (
	"database/sql"
	"log"
	"os"
	
	_"github.com/jackc/pgx/v5/stdlib"
	
	"github.com/joho/godotenv"
)


func init() {
    // loads values from .env
    if err := godotenv.Load(); err != nil {
        log.Print("No .env file found")
    }
}

var DB *sql.DB

func ConnectDB()  error {
	PostgresString := os.Getenv("POSTGRESCONNSTRING")
	db, err := sql.Open("pgx", PostgresString)

	if err != nil{
		return err
	}
	err = db.Ping()

	if err != nil{
		return err
	}

	DB = db
	return nil
}