import React, { Component } from 'react';
import './css/Card.css';

class Card extends Component {
  render () {
    return (
      <div className='card'>
        <img src={`resources/imgs/cards/${this.props.name}.png`} />
      </div>
    );
  }
}

export default Card;
