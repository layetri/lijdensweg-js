import Player from './Player';

export default class Game {
  constructor(user, localConnection) {
    this.allPlayers = [];
    this.activePlayers = [];
    this.player = null;
    this.connection = null;
    this.local = localConnection;
    this.user = user;
  }

  joinGame(connection) {
    this.player = new Player(this.user.name, this.user.id, connection, this.local);
    this.allPlayers.push(this.player);
    this.connection = connection;
  }

  playerJoins(player) {
    this.allPlayers.push(player);
  }

  playerLeaves(player) {
    this.allPlayers.remove(player);
  }

  startGame() {
    this.activePlayers = this.allPlayers.shuffle();
    this.sendMessageToAll('startGame', []);
    while(this.activePlayers.length > 0) {
      this.nextTurn();
    }
    this.endGame();
  }

  endGame() {

  }

  nextTurn() {
    // TODO: implement timeout for player turn
    // TODO: limit turn action to current active player only

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
      if (currentTile.isJunction) {
        player.sendMessage('chooseNextTile').then((response) => {
          //wait for response
          currentTile = response;
        });
      }
      else {
        currentTile = currentTile.nextTiles[0];
      }

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
      this.connection.send(messageType, data);
    }
  }

  rollDice() {
    return Math.round(Math.random() * 5) + 1;
  }

  getRandomCard() {

  }
}