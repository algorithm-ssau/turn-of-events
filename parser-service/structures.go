package main

import "time"

type Event struct {
	Title     string    `json:"title"`
	Date      string    `json:"date"`
	Time      string    `json:"time"`
	Price     string    `json:"price"`
	Place     string    `json:"place"`
	ImageUrl  string    `json:"imageUrl"`
	CreatedAt time.Time `json:"createdAt"`
}
