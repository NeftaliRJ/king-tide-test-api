package handlers

import (
    "net/http"
    "io/ioutil"
    "api-gateway/internal/services"
    "api-gateway/internal/middleware"
)

func OrdersHandler(orderServiceURL string) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        token := middleware.GetTokenFromRequest(r)
        if token == "" {
            w.WriteHeader(http.StatusUnauthorized)
            return
        }

        body, err := ioutil.ReadAll(r.Body)
        if err != nil {
            w.WriteHeader(http.StatusBadRequest)
            return
        }

        // Utiliza el servicio de pedidos
        respBody, err := services.CreateOrder(orderServiceURL, body)
        if err != nil {
            w.WriteHeader(http.StatusInternalServerError)
            return
        }

        w.Write(respBody)
    }
}
