package main

import (
	"errors"
	"fmt"
	"strings"
)

// Player represents a player in the game.
type Player struct {
	Name   string `json:"name"`
	Health int    `json:"health"`
}

type Damageable interface {
	TakeDamage(amount int) error
}

const MaxHealth = 100

var ErrDead = errors.New("player is dead")

func (p *Player) TakeDamage(amount int) error {
	if p.Health <= 0 {
		return ErrDead
	}
	p.Health -= amount
	return nil
}

func main() {
	players := []*Player{{Name: "Godette", Health: MaxHealth}}
	ch := make(chan string, 1)
	go func() { ch <- strings.ToUpper("ready") }()
	for i, p := range players {
		defer fmt.Println("done", i)
		switch err := p.TakeDamage(25); {
		case errors.Is(err, ErrDead):
			fmt.Printf("%s died\n", p.Name)
		default:
			fmt.Println(<-ch, p.Health, true, nil, 0x1F, 3.5)
		}
	}
}
