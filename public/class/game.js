import Player from './Player';
import LocalPlayer from './LocalPlayer';

export default class Game {
  constructor(user, room, localConnection) {
    // Keep track of players
    this.allPlayers = [];
    this.activePlayers = [];
    this.player = null;

    // Store all the important bits
    this.connection = null;
    this.local = localConnection;
    this.user = user;
    this.room = room;

    // Keep track of turns
    this.turn_number = 0;
    this.order_number = 0;
  }

  joinGame(connection) {
    this.player = new LocalPlayer(this.user.name, this.user.id, connection, this.local);
    this.allPlayers.push(this.player);
    this.connection = connection;
  }

  playerJoins(player) {
    let instance =  new Player(player.name, player.id);
    this.allPlayers.push(instance);
  }

  playerLeaves(player) {
    this.allPlayers.splice(this.allPlayers.indexOf(player), 1);
  }

  startGame() {
    let order = [];
    let arr = [];

    for(let i = 0; i < this.allPlayers.length; i++) {
      let num = Math.floor(Math.random() * this.allPlayers.length);
      do {
        num = Math.floor(Math.random() * this.allPlayers.length);
      } while (arr.indexOf(num) !== -1);

      arr.push(num);
      order.push({id: this.allPlayers[i].id, order: num});
    }

    this.sendMessageToAll('startGame', {startOrder: order});
    // while(this.activePlayers.length > 0) {
    //   this.nextTurn();
    // }
    // this.endGame();

    return order;
  }

  endGame() {

  }

  reset() {
    // Reset global game vars
    this.turn_number = 0;
    this.order_number = 0;
    this.activePlayers = [];

    // Reset player vars
    this.player.insanity = 0;
    this.player.infection = 0;
    this.player.cards = [];
  }

  nextTurn() {
    // TODO: implement timeout for player turn
    // TODO: limit turn action to current active player only

    let player = this.allPlayers.find(player => {
      return player.play_order === this.order_number;
    });

    this.activePlayers.push(player);

    if(player.id === this.player.id) {
      this.startTurn(player);
    }
  }

  startTurn() {
    let dice = this.rollDice();
    let currentTile = this.player.currentTile;

    this.player.sendMessage('yourTurn');
    this.player.sendMessage('rollDice', {dice: dice}).then();

    // this.player.sendMessage('chooseCard').then((response) => {
    //   if (response.type === 'pickedCard') {
    //     this.player.giveCard(this.getRandomCard())
    //   }
    // });
    let turn = Math.floor(this.turn_number / this.allPlayers.length) + 1;
    axios.get('/fetch/card?sanity='+this.player.insanity+'&turn_number='+turn+'&stack='+JSON.stringify(this.player.cards)).then(res => {
      console.log(res.data);
      this.player.card = res.data;
      this.player.cards.push(res.data.card.id);
    });

    //wait for response

    // for (let i = 0; i < dice; i++) {
    //   if (currentTile.isJunction) {
    //     this.player.sendMessage('chooseNextTile').then((response) => {
    //       //wait for response
    //       currentTile = response;
    //     });
    //   } else {
    //     currentTile = currentTile.nextTiles[0];
    //   }
    //
    //   this.player.movePlayer(player, currentTile);
    //   if (currentTile.isEndTile) {
    //     this.endTurn(player);
    //     return;
    //   }
    // }

    currentTile.tileUpdate();
  }

  endTurn(player = this.activePlayers[0]) {
    if(player.id === this.player.id) {
      this.activePlayers.splice(this.activePlayers.indexOf(player), 1);

      this.player.sendMessage('turnEnd');
      this.sendMessageToAll('playerFinished', {player: player.id});
      this.turn_number++;
      this.order_number = this.turn_number % this.allPlayers.length;
      this.nextTurn();
    }
  }

  handleEndOfTurn() {
    this.turn_number++;
    this.order_number = this.turn_number % this.allPlayers.length;
    this.nextTurn();
  }

  sendMessageToAll(messageType, data) {
    /*
      Events:
      - startGame
      - playerFinished
      - receivedChat
     */
    this.connection.whisper(messageType, data);
  }

  rollDice() {
    return Math.round(Math.random() * 5) + 1;
  }

  getRandomCard() {

  }
}