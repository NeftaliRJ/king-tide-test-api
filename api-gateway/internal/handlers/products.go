package handlers

import (
    "net/http"
    "api-gateway/internal/services"
    "api-gateway/internal/middleware"
)

func ProductsHandler(productServiceURL string) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        token := middleware.GetTokenFromRequest(r)
        if token == "" {
            w.WriteHeader(http.StatusUnauthorized)
            return
        }

        // Utiliza el servicio de productos
        body, err := services.GetProducts(productServiceURL)
        if err != nil {
            w.WriteHeader(http.StatusInternalServerError)
            return
        }

        w.Write(body)
    }
}
