export default class Player {
  constructor(name, id, connection, local) {
    this.name = name;
    this.id = id;
    this.connection = connection;
    this.local = local;
    this.currentTile = null;
    this.cards = [];
    this.infection = 0;
    this.insanity = 50;
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

  async sendMessage(messageType, data) {
    //this.connection.send(messageType, data);
    /*
    Events:
    - startGame
    - chooseCard {response->type: [pickedCard, ...]}
    - rollDice
    - chooseNextTile
    - playerFinished

    - giveCard
    - useCard

    -
     */
    this.local.$emit(messageType, data);

    return 'yay';
  }
}