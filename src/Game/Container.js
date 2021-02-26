import React, { Component } from 'react';

import Menu from './Menu';
import Game from './Game';
import Info from './Info';

class Container extends Component {
  constructor (props) {
    super();

    this.pages = [Menu, Game, Info];
    this.games = ['Blackjack', 'Oko bere'];

    this.state = {
      activePageIndex: 1,
      gameIndex: 0
    };
  }

  changePage () {

  }

  render () {
    const Current = this.pages[this.state.activePageIndex];
    return (<Current gameIndex={this.state.gameIndex} changePageHandle={this.changePage.bind(this)} />);
  }
}

export default Container;
