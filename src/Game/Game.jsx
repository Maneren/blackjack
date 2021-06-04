import { Component } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import SweetAlert from 'react-bootstrap-sweetalert';

import Utils from 'my-utils';

import styles from './css/Game.module.css';

import CardStacker from './CardStacker';
import Card from './Card';
import MessageBox from './MessageBox';

import { Hand } from './scripts';

const { Array: { shuffle }, Range: { range }, React: { classListBuilder } } = Utils;
const classes = classListBuilder(styles);

class Game extends Component {
  constructor (props) {
    super(props);

    this.state = {
      gameIndex: props.gameIndex,
      player: new Hand(),
      dealer: new Hand(),
      bet: 0,
      money: 100,
      showBetPrompt: false,
      errorMessage: ''
    };

    this.data = {
      rules: {},
      deck: [],
      discarded: []
    };

    this.betPrompt = null;

    this.rngSeed = Math.random();
  }

  static get rules () {
    return [
      {
        name: 'Black Jack',
        deckParameters: {
          totalSize: () => this.setSize * this.sets,
          setSize: 52,
          sets: 4,
          setColors: ['red', 'blue', 'green', 'gray', 'purple', 'yellow'],
          cards: [
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            'J',
            'Q',
            'K',
            'A'
          ],
          values: [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11],
          colors: ['C', 'D', 'H', 'S']
        },
        burn: true
      },
      {
        name: 'Oko bere',
        deckParameters: {
          totalSize: () => this.setSize * this.sets,
          setSize: 32,
          sets: 1,
          setColors: ['green'],
          cards: ['7', '8', '9', '10', 'Sp', 'Sv', 'K', 'E'],
          values: [7, 8, 9, 10, 1, 1, 2, 11],
          colors: ['S', 'Ž', 'K', 'Z']
        },
        burn: false
      }
    ];
  }

  setData (newData) {
    const { data } = this;
    this.data = { ...data, ...newData };
  }

  setStateSync (stateUpdate) {
    return new Promise(resolve => this.setState(stateUpdate, resolve));
  }

  componentDidMount () {
    this.init();
  }

  async init () {
    this.rngSeed = Math.random(); // for CardStacker

    this.setData({ rules: Game.rules[this.state.gameIndex] });

    // await this.setStateSync({ initialized: true });
    await this.initDeck();

    // this.addBet(await this.getBet());
    this.addBet(10);

    const { dealer, player } = this.state;
    player.discardAll();
    dealer.discardAll();

    player.draw(this.drawFromDeck());
    player.draw(this.drawFromDeck());

    dealer.draw(this.drawFromDeck());
    dealer.draw(this.drawFromDeck(), true);

    this.setState({ player, dealer });
  }

  initDeck () {
    const { deck, discarded, rules } = this.data;

    const newDeck = deck.length > 0 ? [...deck, ...discarded] : Game.generateDeck(rules.deckParameters);

    shuffle(newDeck);

    this.setData({ deck: newDeck });
  }

  static generateDeck (params) {
    const deck = [];

    for (const i of range(params.sets)) {
      for (const color of params.colors) {
        for (const cardI in params.cards) {
          const card = Object.freeze({
            color,
            setColor: params.setColors[i],
            name: params.cards[cardI],
            value: params.values[cardI]
          });

          deck.push(card);
        }
      }
    }

    return deck;
  }

  drawFromDeck () {
    const { deck, rules } = this.data;

    if (rules.burn) this.discard(deck.shift());

    const card = deck.shift();
    this.setData({ deck });

    return card;
  }

  discard (...cards) {
    let { discarded } = this.data;
    discarded = discarded.concat(cards);
    this.setData({ discarded });
  }

  playerHasEnoughMoney (amount) {
    const { money } = this.state;
    return money >= amount;
  }

  async addBet (amount) {
    console.log(amount);
    let { money, bet } = this.state;
    money -= amount;
    bet += amount;
    await this.setStateSync({ money, bet });
  }

  async getBet () {
    if (this.betPrompt) return;
    return new Promise((resolve, reject) => {
      this.handleBetInput = input => {
        try {
          console.log(input);
          // validate input
          input = input.trim();
          if (!input) throw new Error('No input');

          input = input.replace(/^0+/, '');
          const n = Math.floor(Number(input));

          const isInt = n !== Infinity && String(n) === input && n >= 0;
          if (!isInt) throw new Error('Invalid input');

          if (!this.playerHasEnoughMoney(n)) throw new Error('Insufficient funds');

          this.setState({ showBetPrompt: false });
          resolve(n);
        } catch (e) { reject(e.messsage); }
      };
      this.setState({ showBetPrompt: true });
    });
  }

  async handleButton (type) {
    await this.setStateSync({ errorMessage: '' });

    const { player, bet } = this.state;
    const { plays, data } = this;

    switch (type) {
      case 'draw':
        plays.draw(player);
        break;

      case 'double':
        plays.double(player, bet);
        break;

      case 'save':
        plays.save();
        break;

      case 'stay':
        plays.stay();
        break;

      case 'surrender':
        plays.surrender();
        break;

      default:
        throw new Error(`unknown action type: ${type}`);
    }

    this.forceUpdate();

    console.log(this.data);

    const { total } = player.calcedTotal;
    if (total > 21) {
      this.showError('Over 21!');
      this.handleEnd();
    } else if (data.playerEnded) this.playDealer();
  }

  get plays () {
    return {
      draw: player => player.draw(this.drawFromDeck()),
      double: (player, bet) => {
        if (!this.playerHasEnoughMoney(bet)) return this.showError('Insufficient funds!');
        this.addBet(bet);
        player.draw(this.drawFromDeck());
        this.setData({ playerEnded: true });
      }
    };
  }

  showError (message) {
    this.setState({ errorMessage: message });
  }

  render () {
    const { dealer, player, showBetPrompt, errorMessage } = this.state;

    /**
     * @param {{player: Hand, className: string}} props
     */
    const PlayerView = ({ player, className }) => (
      <div className={className}>
        <span className={classes('score dealer')}>
          {player.calcedTotal.total}
        </span>
        <CardStacker seed={this.rngSeed}>
          {player.cards.map(({ data, faceDown }, i) => <Card card={data} key={i} faceDown={faceDown} />)}
        </CardStacker>
      </div>
    );

    /**
     * @param {{id: string, children: string, disabled: boolean}} props
     */
    const ControlButton = ({ id, children, disabled }) => (
      <Button
        variant='primary'
        onClick={() => this.handleButton(id)}
        className={classes('button')}
        disabled={disabled}
      >
        {children}
      </Button>
    );

    const buttons = [
      ['draw', 'Draw'],
      ['save', 'Save'],
      ['stay', 'Stay'],
      ['double', 'Double'],
      ['split', 'Split', true],
      ['surrender', 'Surrender']
    ];

    return (
      <div className={classes('game-container')}>
        <PlayerView className={classes('cards-container dealer')} player={dealer} />
        <PlayerView className={classes('cards-container player')} player={player} />
        <div className={classes('buttons')}>
          <ButtonGroup className={classes('blackjack-buttons')}>
            {buttons.map(([id, displayName, disabled]) => (
              <ControlButton
                key={id}
                id={id}
                disabled={!!disabled}
              >
                {displayName}
              </ControlButton>
            ))}
          </ButtonGroup>
          {/* <ButtonGroup className={classes('oko-buttons')}>
            <Button variant='primary' onClick={() => this.handleButton('draw')} className={classes('button')}>Draw</Button>
            <Button variant='primary' onClick={() => this.handleButton('draw')} className={classes('button')}>Stay</Button>
            <Button variant='primary' onClick={() => this.handleButton('draw')} className={classes('button')}>Surrender</Button>
          </ButtonGroup> */}
        </div>
        {errorMessage.length > 0 ? <MessageBox type='danger' message={errorMessage} /> : null}
        {showBetPrompt
          ? <SweetAlert
              input
              inputType='number'
              cancelBtnBsStyle='light'
              title='Bet'
              validationMsg='You must enter valid amount!'
              onConfirm={this.handleBetInput}
              onCancel={this.handleOnCancel}
            />
          : null}
      </div>
    );
  }
}

export default Game;
