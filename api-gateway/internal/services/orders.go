package services

import (
    "bytes"
    "io/ioutil"
    "net/http"
)

func CreateOrder(orderServiceURL string, orderData []byte) ([]byte, error) {
    req, err := http.NewRequest("POST", orderServiceURL+"/orders", bytes.NewBuffer(orderData))
    if err != nil {
        return nil, err
    }
    req.Header.Set("Content-Type", "application/json")

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    respBody, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        return nil, err
    }

    return respBody, nil
}
