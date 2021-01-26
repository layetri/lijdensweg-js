export class Game {
  constructor() {
    this.allPlayers = [];
    this.activePlayers = [];
    this.player = null;
  }

  joinGame(connection) {
    this.player = new Player(connection);
  }

  playerJoins(player) {
    this.allPlayers.push(player);
  }

  playerLeaves(player) {
    this.allPlayers.remove(player);
  }

  startGame() {
    this.activePlayers = this.allPlayers.shuffle();
    this.sendInfoToAll();
    while(this.activePlayers.length > 0) {
      this.nextTurn();
    }
    this.endGame();
  }

  endGame() {

  }

  nextTurn() {
    let player = this.activePlayers.shift();
    this.activePlayers.push(player);
    let currentTile = player.currentTile;

    player.sendMessage('chooseCard').then((response) => {
      if (response.type === 'pickedCard') {
        player.giveCard(this.getRandomCard())
      }
    });

    //wait for response

    player.sendMessage('rollDice');
    //wait for response

    for(let i = 0; i < this.rollDice(); i++) {
      player.currentTile = player.currentTile.nextTile;
      this.player.movePlayer(player, currentTile);
      if (currentTile.isEndTile) {
        this.playerFinished(player);
        return;
      }
    }
    currentTile.tileUpdate();
  }

  playerFinished(player) {
    this.activePlayers.remove(player);
    this.sendMessageToAll('playerFinished', player);
  }

  sendMessageToAll(messageType, data) {
    for(let i = 0; i < this.allPlayers.length; i++) {
      this.allPlayers[i].sendMessage(messageType, data);
    }
  }

  rollDice() {
    return Math.round(Math.random() * 5) + 1;
  }

  getRandomCard() {

  }
}