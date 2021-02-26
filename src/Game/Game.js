import React, { Component } from 'react';
import Utils from './Utils';
import Card from './Card';

class Game extends Component {
  constructor (props) {
    super(props);

    this.state = {
      gameIndex: props.gameIndex,
      deck: [],
      discarded: []
    };

    this.init();
  }

  static get rules () {
    return [
      {
        name: 'Black Jack',
        deckParameters: {
          totalSize: 208,
          setSize: 52,
          sets: 4,
          setColors: ['red', 'blue', 'green', 'grey', 'purple', 'yellow'],
          cards: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
          values: [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11],
          colors: ['C', 'D', 'H', 'S']
        }
      },
      {
        name: 'Oko bere',
        deckParameters: {
          totalSize: 32,
          setSize: 32,
          sets: 1,
          cards: ['7', '8', '9', '10', 'Sp', 'Sv', 'K', 'E'],
          values: [7, 8, 9, 10, 1, 1, 2, 11],
          colors: ['S', 'Ž', 'K', 'Z']
        }
      }
    ];
  }

  static generateDeck (params) {
    const deck = [];

    for (const i of Utils.range(params.sets)) {
      for (const color of params.colors) {
        for (const cardI in params.cards) {
          deck.push({
            color,
            setColor: params.setColors[i],
            name: params.cards[cardI],
            value: params.values[cardI]
          });
        }
      }
    }

    return deck;
  }

  init () {
    const deck = Game.generateDeck(Game.rules[this.state.gameIndex].deckParameters);
    Utils.shuffle(deck);
    this.setState({ deck });
  }

  draw (burn) {
    const { deck } = this.state;
    if (burn) this.discard(deck.shift());
    const card = deck.shift();
    this.setState({ deck });
    return card;
  }

  discard (...cards) {
    const { discarded } = this.state;
    discarded.concat(cards);
    this.setState({ discarded });
  }

  render () {
    const { range, mapRng } = Utils;
    return (
      <div className='game-container'>
        <div className='cards-container dealer' />
        <div className='cards-container player'>

          <Card name='KC' />
        </div>
      </div>
    );
  }
}

export default Game;
