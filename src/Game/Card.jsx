import cardImgs from './resources/imgs/cards';
import styles from './css/Card.module.css';

function Card ({
  card: { name: value, color, setColor },
  faceDown
}) {
  const name = faceDown ? `${setColor}_back` : value + color;
  return (
    <div className={`${styles.card}`}>
      <img src={cardImgs[name]} alt='card' />
    </div>
  );
}

export default Card;
