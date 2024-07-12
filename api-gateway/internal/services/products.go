package services

import (
    "io/ioutil"
    "net/http"
)

func GetProducts(productServiceURL string) ([]byte, error) {
    resp, err := http.Get(productServiceURL + "/products")
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        return nil, err
    }

    return body, nil
}
