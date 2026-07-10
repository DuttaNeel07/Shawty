package service

import (
	"crypto/md5"
	"encoding/hex"
)

func CreateHash(url string) string{
	data := []byte(url)
	hasher := md5.New()
	hasher.Write(data)
	hashBytes := hasher.Sum(nil)
	hashString := hex.EncodeToString(hashBytes)
	hashString = hashString[:8]

	return hashString
}