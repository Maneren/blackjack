import React, { Component } from 'react';

class Info extends Component {
  render () {
    return (
      <div className='info-page'>
        Sources:
        <ul className='sources'>
          <li className='source'>Cards: <a href='http://acbl.mybigcommerce.com/52-playing-cards/'>mybigcommerce.com</a></li>
          <li className='source' />
          <li className='source' />
          <li className='source' />
          <li className='source' />
        </ul>
      </div>
    );
  }
}

export default Info;
