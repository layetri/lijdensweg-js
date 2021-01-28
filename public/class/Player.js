export default class Player {
  constructor(name, id) {
    this.name = name;
    this.id = id;
    this.play_order = null;
    this.currentTile = null;
    this.infection = 0;
    this.insanity = 0;
  }

  giveCard(card) {
    this.cards.push(card);
    this.sendMessage('giveCard', card).then();
  }

  useCard(card) {
    card.perform();
    this.sendMessage('useCard', card).then();
    this.cards.remove(card);
  }
}