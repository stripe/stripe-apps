package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/webhook"

	_ "github.com/joho/godotenv/autoload"
)

type Settings struct {
	Country    string `json:"country"`
	Language   string `json:"language"`
	User_id    string `json:"user_id"`
	Account_id string `json:"account_id"`
}

type User struct {
	User_id    string `json:"user_id"`
	Account_id string `json:"account_id"`
}

// This Map represents a database or other external infrastructure for
// the purposes of this example. In a production system you would need
// to set up a true persistent store.
var db = make(map[string]Settings)

func saveSettings(res http.ResponseWriter, req *http.Request) {
	const MaxBodyBytes = int64(65536)

	req.Body = http.MaxBytesReader(res, req.Body, MaxBodyBytes)

	var data Settings
	err := json.NewDecoder(req.Body).Decode(&data)
    if err != nil {
        http.Error(res, err.Error(), http.StatusBadRequest)
        return
    }
	user := &User{User_id: data.User_id, Account_id: data.Account_id}
	payload, _ := json.Marshal(user)

	appSecret := os.Getenv("APP_SECRET")

	signatureErr := webhook.ValidatePayload(payload, req.Header.Get("Stripe-Signature"), appSecret)
	if signatureErr != nil {
		fmt.Fprintf(os.Stderr, "Error verifying webhook signature: %v\n", signatureErr)
		res.WriteHeader(http.StatusBadRequest)
	}

	db[data.User_id] = Settings{User_id: data.User_id, Account_id: data.Account_id, Country: data.Country, Language: data.Language}

	res.WriteHeader(http.StatusOK)
}

func getSettings(res http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	id := vars["key"]

	storedSettings := db[id]
	if storedSettings.User_id == "" {
		res.WriteHeader(http.StatusNotFound)
	}

	jsonData, _ := json.Marshal(storedSettings)
	res.WriteHeader(http.StatusOK)
	res.Write(jsonData)
}

func main() {
	port := 8080
	mux := mux.NewRouter()

	// Add Cors
	c := cors.New(cors.Options{
		AllowedMethods: []string{"POST", "GET", "OPTIONS"},
		AllowedOrigins: []string{"*"},
		AllowedHeaders: []string{"content-type", "stripe-signature"},
	})
	
	
	stripe.Key = os.Getenv("STRIPE_API_KEY")
	mux.HandleFunc("/api/settings", saveSettings)
	mux.HandleFunc("/api/settings/{key}", getSettings)
	
	handler := c.Handler(mux)
	log.Println("starting web server on", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%v", port), handler))
}
