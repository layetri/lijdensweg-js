import Player from './Player';

export default class LocalPlayer extends Player {
  constructor(name, id, connection, local) {
    super(name, id);
    this.connection = connection;
    this.local = local;
    this.cards = [];
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