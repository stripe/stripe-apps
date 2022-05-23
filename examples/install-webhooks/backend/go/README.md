# Install-webhooks Example (Go Server)
A Go server implementation with net/http

## Requirements
 - Go v1.x 
 - [Configured .env file](https://github.com/stripe/stripe-apps/blob/master/examples/install-webhooks/README.md#backend)

## How to run
1. Make sure you have Go installed on your machine

2. From the `Go` directory initialize the go server:

```bash
go mod init stripe.com/install-webhooks
```
3. Add module requirements:

```bash
go mod tidy
```

4. Run the application

```bash
go run main.go
```

Server is running on `localhost:8080`
