package model

import "database/sql"

var DB *sql.DB

type links struct{
		orgLink string
		customAlias string
		randomAlias string
		clicks int64
		username string
}

func allLinks() ([]links, error){

	rows,err := DB.Query("SELECT * FROM links")
	if err != nil{
		return nil,err
	}
	defer rows.Close()

	var lnks []links

	for rows.Next(){
		var lnk links

		err := rows.Scan(&lnk.orgLink, &lnk.customAlias, & lnk.randomAlias, &lnk.clicks, &lnk.username)

		if err != nil{
			return nil,err
		}

		lnks = append(lnks, lnk)

		if err = rows.Err(); err != nil{
			return nil, err
		}
		return lnks, nil
	}
}