package main

import (
    "log"
    "net/http"

    "api-gateway/internal/config"
    "api-gateway/internal/handlers"
    "api-gateway/internal/middleware"

    "github.com/gorilla/mux"
)

func main() {
    cfg := config.LoadConfig()

    router := mux.NewRouter()

    router.HandleFunc("/login", handlers.LoginHandler).Methods("POST")
    router.HandleFunc("/products", handlers.ProductsHandler(cfg.ProductService)).Methods("GET")
    router.HandleFunc("/orders", handlers.OrdersHandler(cfg.OrderService)).Methods("POST")

    router.Use(middleware.JwtAuthentication(cfg.JwtSecret))
    router.Use(middleware.RateLimiter)

    log.Printf("Server running on port %s", cfg.Port)
    log.Fatal(http.ListenAndServe(":"+cfg.Port, router))
}
