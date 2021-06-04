import React from 'react';
import styles from './css/CardStacker.module.css';
import './css/react-transitions.css';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import seedrandom from 'seedrandom';

function CardStacker (props) {
  const cards = props.children;
  const rng = seedrandom(props.seed);

  const random = (min, max) => min + (rng.quick() * (max - min));

  return (
    <div className={styles.wrapper}>
      <TransitionGroup className={styles.container}>
        {
          cards.map((child, i) => (
            <CSSTransition key={i} classNames='cards' timeout={100}>
              <div
                className={styles.card}
                style={{ transform: `translate(${random(-1, 1)}px, ${random(-2, 2)}px) rotate(${random(-2, 2)}deg)` }}
              >
                {child}
              </div>
            </CSSTransition>
          ))
        }
      </TransitionGroup>
    </div>
  );
}

export default CardStacker;
