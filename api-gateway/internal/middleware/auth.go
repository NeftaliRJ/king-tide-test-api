package middleware

import (
    "net/http"
    "strings"

    "github.com/dgrijalva/jwt-go"
)

type Claims struct {
    Username string `json:"username"`
    jwt.StandardClaims
}

func JwtAuthentication(jwtKey string) func(http.Handler) http.Handler {
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            if r.URL.Path == "/login" {
                next.ServeHTTP(w, r)
                return
            }

            tokenStr := GetTokenFromRequest(r)
            if tokenStr == "" {
                http.Error(w, "Unauthorized", http.StatusUnauthorized)
                return
            }

            claims := &Claims{}
            token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
                return []byte(jwtKey), nil
            })
            if err != nil || !token.Valid {
                http.Error(w, "Unauthorized", http.StatusUnauthorized)
                return
            }

            next.ServeHTTP(w, r)
        })
    }
}

func GetTokenFromRequest(r *http.Request) string {
    authHeader := r.Header.Get("Authorization")
    if authHeader == "" {
        return ""
    }
    parts := strings.Split(authHeader, " ")
    if len(parts) != 2 || parts[0] != "Bearer" {
        return ""
    }
    return parts[1]
}
