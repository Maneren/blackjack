export class Hand {
  constructor () {
    this.cards = [];
  }

  draw (card, faceDown = false) {
    card = { data: card, faceDown };
    this.cards.push(card);
  }

  discardAll () {
    const cards = this.cards;
    this.cards = [];
    return cards;
  }

  get calcedTotal () {
    const { cards } = this;

    let total = +cards.reduce((total, card) => card.faceDown ? total : total + card.data.value, 0);

    const acesCount = cards.reduce((total, card) => total + (card.data.name === 'A'), 0);
    const soft = acesCount > 0;

    let used = 0;
    while (total > 21 && used < acesCount) {
      total -= 10;
      used++;
    }

    return { total, soft };
  }
}
