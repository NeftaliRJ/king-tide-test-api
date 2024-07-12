package middleware

import (
    "net/http"
    "time"

    "github.com/juju/ratelimit"
)

var bucket = ratelimit.NewBucket(1*time.Second, 5)

func RateLimiter(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        if bucket.TakeAvailable(1) == 0 {
            http.Error(w, "Too Many Requests", http.StatusTooManyRequests)
            return
        }
        next.ServeHTTP(w, r)
    })
}
