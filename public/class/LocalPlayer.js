import Player from './Player';

export default class LocalPlayer extends Player {
  constructor(name, id, connection, local) {
    // TODO: implement money
    super(name, id);
    this.connection = connection;
    this.local = local;
    this.cards = [];
    this.card = null;
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

    return this.local.$on('resumeBackend', res => {
      return res;
    });
  }
}