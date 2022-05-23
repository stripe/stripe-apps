package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/account"
	"github.com/stripe/stripe-go/v72/webhook"
)
import _ "github.com/joho/godotenv/autoload"




type Account struct {
	ID	string	`json:"id"`
	Name	string	`json:"name"`
	DateCreated time.Time	`json:"dateCreated"`
}

// This Map represents a database or other external infrastructure for
// the purposes of this example. In a production system you would need
// to set up a true persistent store.
var accountStore = make(map[string]Account)



//Contructing the event
func constructEventHandler(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "application/json")
	const MaxBodyBytes = int64(65536)
	req.Body = http.MaxBytesReader(res, req.Body, MaxBodyBytes)
	payload, payloadError := ioutil.ReadAll(req.Body)
	if payloadError != nil {
		fmt.Fprintf(os.Stderr, "Error reading request body: %v\n", payloadError)
		res.WriteHeader(http.StatusServiceUnavailable)
		return
	}

	endpointSecret := os.Getenv("STRIPE_WEBHOOK_SECRET");

	event, webhookError := webhook.ConstructEvent(payload, req.Header.Get("Stripe-Signature"),
		endpointSecret)

	if webhookError != nil {
		fmt.Fprintf(os.Stderr, "Error verifying webhook signature: %v\n", webhookError)
		res.WriteHeader(http.StatusBadRequest) // Return a 400 error on a bad signature
		return
	}

	// Unmarshal the event data into an appropriate struct depending on its Type
	switch event.Type {
	case "account.application.authorized":
	// We also trigger on customer events for testing purposes because
    // application.authorized events cannot be triggered via the CLI yet
	case "customer.created":
		accountData, _ := account.GetByID(
			event.Account,
			nil,
		)
		accountStore[accountData.ID] = Account{ ID: accountData.ID, Name: accountData.BusinessProfile.Name, DateCreated: time.Now() }
	// The "deauthorized" event will get sent when an account uninstalls the App
	default:
		delete(accountStore, event.Account)
	}
	
	res.WriteHeader(http.StatusOK)
}

func getAccounts(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "application/json")

	values := []Account{}
    for _, value := range accountStore {
        values = append(values, value)
    }

	json.NewEncoder(res).Encode(values)
}


func main() {
	port := 8080 
	
	stripe.Key = os.Getenv("STRIPE_API_KEY")

	http.HandleFunc("/webhook", constructEventHandler)
	http.HandleFunc("/accounts", getAccounts)

	log.Println("starting web server on", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%v", port), nil)) 
}
