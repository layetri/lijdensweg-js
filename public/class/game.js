import Player from './Player';
import LocalPlayer from './LocalPlayer';
import Board from './Board';

export default class Game {
  constructor(user, room, localConnection) {
    // Keep track of players
    this.allPlayers = [];
    this.player = null;

    // Store all the important bits
    this.connection = null;
    this.local = localConnection;
    this.user = user;
    this.room = room;
    this.board = null;

    // Keep track of turns
    this.turn_number = 0;
    this.order_number = 0;
    this.dice_int = 0;

    this.animationBusy = false;
    this.pauseMoving = false;
    this.chosenTile = null;
    this.junctionFlag = false;
  }

  joinGame(connection) {
    this.player = new LocalPlayer(this.user.name, this.user.id, this, connection, this.local);
    this.allPlayers.push(this.player);
    this.connection = connection;
  }

  playerJoins(player) {
    let instance =  new Player(player.name, player.id, this);
    this.allPlayers.push(instance);
  }

  playerLeaves(player) {
    this.allPlayers.splice(this.allPlayers.indexOf(player), 1);
  }

  makeBoard() {
    this.board = new Board(this);
    this.board.createBoard();
  }

  loadBoard(board) {
    this.board = new Board(this);
    this.board.fill(board);
  }

  generateOrder() {
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

    this.sendMessageToAll('orderPlayers', {startOrder: order});

    return order;
  }

  // Wait for an animation to finish
  wait() {
    do {
      // Wait until animation is over
    } while(this.animationBusy);
  }

  startGame() {
    this.sendMessageToAll('startGame');
  }

  endGame() {

  }

  reset() {
    // Reset global game vars
    this.turn_number = 0;
    this.order_number = 0;

    // Reset player vars
    this.player.insanity = 0;
    this.player.infection = 0;
    this.player.cards = [];

    let colors = ['blue', 'green', 'yellow', 'red', 'pink', 'purple'];
    for(let i = 0; i < this.allPlayers.length; i++) {
      let color = 'grey';
      do {
        color = colors[Math.floor(Math.random() * 6)];
      } while(this.allPlayers.filter(p => {
        return p.color === color
      }).length > 0);

      this.allPlayers[i].color = color;
    }

    this.player.jumpToStart();
  }

  nextTurn() {
    this.turn_number++;
    this.order_number = this.turn_number % this.allPlayers.length;

    if(this.order_number === this.player.play_order) {
      this.player.sendMessage('yourTurn');
    }
  }

  startTurn() {
    let dice = this.rollDice();

    let cb = () => {
      let i = 0;
      let currentTile = this.player.currentTile;

      this.dice_int = setInterval(() => {
        if(!this.pauseMoving) {
          if (i < dice) {
            if (currentTile.isJunction() && i <= dice - 1) {
              if(this.chosenTile !== null) {
                // Fill in the user selected tile
                currentTile = this.board.find(currentTile.nextTiles[this.chosenTile]);
              } else {
                this.junctionFlag = true;
                this.pauseMoving = true;
              }
            } else {
              currentTile = this.board.find(currentTile.nextTiles[0]);
            }

            if(!this.pauseMoving) {
              document.getElementById("gameContainer").scrollLeft = currentTile.xDist > 2 ? (currentTile.xDist * 200) - 400 : 0;
              this.player.updatePlayerPosition(currentTile);
              i++;
            }
          } else {
            clearInterval(this.dice_int);
            currentTile.tileUpdate();
            this.pickCard();
          }
        }
      }, 750);
    }

    this.player.sendMessage('rollDice', {dice: dice, callback: cb}).then();
    this.player.earn(5);
  }

  endTurn() {
    if(this.order_number === this.player.play_order) {
      this.player.sendMessage('turnEnd').then(() => {});
      this.sendMessageToAll('playerFinished', {player: this.player.id});
      this.nextTurn();
    }
  }

  sendMessageToAll(messageType, data = []) {
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

  pickCard() {
    let turn = Math.floor(this.turn_number / this.allPlayers.length) + 1;
    axios.get('/fetch/card?sanity='+this.player.insanity+'&turn_number='+turn+'&stack='+JSON.stringify(this.player.cards)).then(res => {
      this.player.card = res.data;
      this.player.cards.push(res.data.card.id);
    });
  }

  performAction(data) {
    let actions;
    if(data.action.length > 0) {
      actions = JSON.parse(data.action);
    } else {
      actions = data;
    }
    // Action format: [who, what, how much, (optional: item)]
    for(let i = 0; i < actions.length; i++) {
      let action = actions[i];

      if(['current', 'all'].includes(action[0])) {
        // Handle different values to increase
        this.player.handleAction(action);
        // Handle broadcast to other players
        if(action[0] === 'all') {
          this.sendMessageToAll('performAction', action);
        }
      } else if(action[0] === 'others') {
        this.sendMessageToAll('performAction', action);
      }
    }

    this.player.card = null;
  }
}