package config

import (
    "os"
    "log"
    "github.com/joho/godotenv"
)

type Config struct {
    JwtSecret      string
    ProductService string
    OrderService   string
    Port           string
}

func LoadConfig() Config {
    err := godotenv.Load()
    if err != nil {
        log.Printf("Error loading .env file, using default values: %v", err)
    }

    config := Config{
        JwtSecret:      getEnv("JWT_SECRET", "my_secret_key"),
        ProductService: getEnv("PRODUCT_SERVICE", "http://localhost:4000"),
        OrderService:   getEnv("ORDER_SERVICE", "http://localhost:3000"),
        Port:           getEnv("PORT", "8080"),
    }
    return config
}

func getEnv(key, defaultValue string) string {
    value := os.Getenv(key)
    if value == "" {
        log.Printf("Environment variable %s is not set, using default value: %s", key, defaultValue)
        return defaultValue
    }
    return value
}
