package main

import (
	"log"
	"os"
	"time"

	"github.com/boltdb/bolt"
)

var database string
var fileMode os.FileMode = 0600 // o+rw
var db *bolt.DB

func DbInit(path string, buckets []string) error {
	options := &bolt.Options{Timeout: 10 * time.Second}
	database = path
	var err error

	db, err = bolt.Open(database, fileMode, options)
	if err != nil {
		log.Fatal(err)
	}

	err = db.Update(func(tx *bolt.Tx) error {
		for _, value := range buckets {
			_, err := tx.CreateBucketIfNotExists([]byte(value))
			if err != nil {
				return err
			}
		}

		return nil
	})

	return err
}

func DbClose() {
	db.Close()
}

func DbGet(bucket, key []byte) ([]byte, error) {
	var value []byte = nil

	err := db.View(func(tx *bolt.Tx) error {
		v := tx.Bucket(bucket).Get(key)

		// copy bolt Get result as byte slice's contents is not
		// guaranteed to stay the same once the transaction is done
		if v != nil {
			value = make([]byte, len(v))
			copy(value, v)
		}

		return nil
	})

	return value, err
}

func DbPut(bucket, key, value []byte) error {
	return db.Update(func(tx *bolt.Tx) error {
		return tx.Bucket(bucket).Put(key, value)
	})
}

func DbDelete(bucket, key []byte) error {
	return db.Update(func(tx *bolt.Tx) error {
		return tx.Bucket(bucket).Delete(key)
	})
}

func DbGetAllKeys(bucket []byte) (keys [][]byte) {
	db.View(func(tx *bolt.Tx) error {
		tx.Bucket(bucket).ForEach(func(k, v []byte) error {
			// copy bolt ForEach result as byte slice's contents is not
			// guaranteed to stay the same once the transaction is done
			dst := make([]byte, len(k))
			copy(dst, k)
			keys = append(keys, dst)

			return nil
		})

		return nil
	})
	return
}

type DbPair struct {
	Key   []byte
	Value []byte
}

func DbGetAll(bucket []byte) (pairs []DbPair) {
	db.View(func(tx *bolt.Tx) error {
		tx.Bucket(bucket).ForEach(func(k, v []byte) error {
			// copy bolt ForEach result as byte slice's contents is not
			// guaranteed to stay the same once the transaction is done
			dstk := make([]byte, len(k))
			dstv := make([]byte, len(v))
			copy(dstk, k)
			copy(dstv, v)

			pairs = append(pairs, DbPair{dstk, dstv})

			return nil
		})
		return nil
	})
	return
}
