export default class Player {
  constructor(name, id) {
    this.name = name;
    this.id = id;
    this.play_order = null;
    this.currentTile = null;
    this.infection = 0;
    this.insanity = 0;
  }

  increaseInfection(amount = 1) {
    if(this.infection + amount <= 100 && this.infection + amount >= 0) {
      this.infection += amount;
    } else if(this.infection + amount > 100) {
      this.infection = 100;
    } else if(this.infection + amount < 0) {
      this.infection = 0;
    }
  }

  increaseInsanity(amount = 1) {
    if(this.insanity + amount <= 50 && this.insanity + amount >= -50) {
      this.insanity += amount;
    }
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