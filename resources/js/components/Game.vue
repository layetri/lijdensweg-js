<template>
  <div id="mainWindow">
    <div class="w-full flex">
      <div class="flex-auto"></div>
      <div class="flex-grow-0 px-4 py-2" v-if="user !== null">
        <span v-if="!editUsername" @dblclick="editUsername = true">
          {{user.name}}
        </span>
        <input type="text" v-else v-model="user.name" class="py-2 px-4 bg-white rounded shadow" @keydown.enter="updateUsername()">
        <span class="text-gray-700" v-if="room !== null">@ {{room}}</span>
      </div>
    </div>

    <div class="container mx-auto py-9" v-if="!started">
      <div class="flex">
        <div class="w-1/4 p-4 bg-white border-gray-100 shadow rounded-lg">
          <b>Spelers in deze kamer</b>
          <div class="my-4">
            <div v-for="player in game.allPlayers">
              {{player.name}} <span class="text-gray-400" v-if="player.id === user.id">(jij)</span>
            </div>
          </div>

          <button class="text-sm py-2 px-4 bg-blue-400 text-white rounded-lg shadow">Nodig vrienden uit</button>
        </div>
        <div class="flex-auto text-center">
          <button class="text-2xl py-2 px-8 bg-blue-400 text-white rounded-xl shadow" @click="initGame()">start</button>
        </div>
      </div>
    </div>

<!--  Game main screen  -->
    <div class="container mx-auto overflow-auto h-full" v-else>
      <h1 class="text-2xl font-bold p-2">&euro;{{game.player.money}}</h1>
      <div class="w-1/4 p-4 bg-white border-gray-100 shadow rounded-lg">
        <b>Spelers in deze kamer</b>
        <div class="my-4">
          <div :class="[player.play_order === game.order_number ? 'font-bold' : 'text-gray-700']" v-for="player in game.allPlayers">
            {{player.name}} <span class="text-gray-400" v-if="player.id === user.id">(jij)</span>
          </div>
        </div>
      </div>

      <div class="text-9xl font-bold" v-if="dice !== null">
        {{dice}}
      </div>

      <board :board="game.board"></board>

      <card v-if="game.player.card !== null" :card="game.player.card" @perform="performCardAction"></card>
      <button class="text-lg py-2 px-4 bg-blue-400 text-white rounded-lg shadow" v-if="game.player.play_order === game.order_number" @click="game.endTurn()">Klaar</button>

      <div class="w-full fixed bottom-0 left-0">
        <div class="w-3/4 mx-auto">
          <div class="w-1/2 flex float-left">
            <infection-meter class="w-1/2" :amount="game.player.infection"></infection-meter>
            <insanity-meter class="w-1/2" :amount="game.player.insanity"></insanity-meter>
          </div>

          <div class="w-1/2 flex" id="inventoryRow">
            <item v-for="item in game.player.items" :key="game.player.items.indexOf(item)" :item="item" @use="game.player.useItem(item.name)" @buy="game.player.buy(1, item)"></item>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import Game from '../../../public/class/Game';

  export default {
    name: "Game",
    props: {
      user: Object,
      room: String
    },
    data() {
      return {
        localBus: new Vue(),
        game: null,
        editUsername: false,
        board: null,
        connection: null,
        started: false,
        dice: null,
        yourTurn: false,
      }
    },
    created() {
      this.game = new Game(this.user, this.room, this.localBus);

      this.connection = Echo.private('room.'+this.room);
      this.presence = Echo.join('presence.'+this.room)
          .here((players) => {
            if(players.length > 6) {
              this.connection.leave();
              this.presence.leave();
            } else {
              for (let i = 0; i < players.length; i++) {
                if (players[i].id !== this.user.id) {
                  this.game.playerJoins(players[i]);
                }
              }
            }
          }).joining((player) => {
            this.game.playerJoins(player);
          }).leaving((player) => {
            this.game.playerLeaves(player);
            if(this.game.allPlayers.length < 2) {
              this.game.returnToLobby();
              this.started = false;
            }
          });
      this.game.joinGame(this.connection);

      this.handleConnection();
      this.handleUIThread();
    },
    methods: {
      handleConnection() {
        /*
        Events:
        - startGame
        - playerFinished
        - receivedChat
        - changedUsername
       */
        this.connection.listenForWhisper('startGame', data => {
          // Start local game
          this.startGame();
        }).listenForWhisper('orderPlayers', data => {
          // Order the local players with the received player order
          this.orderPlayers(data.startOrder);
        }).listenForWhisper('playerFinished', data => {
          // Handle the end of another player's turn
          this.game.handleEndOfTurn();
        }).listenForWhisper('newChat', data => {
          // Handle incoming chat messages
          console.log(data);
        }).listenForWhisper('changedUsername', data => {
          // Update the local username to reflect changes
          let user = this.game.allPlayers.findIndex(player => {
            return player.id === data.id;
          });

          this.game.allPlayers[user].name = data.name;
        });
      },
      handleUIThread() {
        this.localBus.$on('rollDice', data => {
          this.dice = data.dice;
          setTimeout(() => {
            this.dice = null;
          }, 2000);
        });
      },
      // Initialize the game [only ran on initial client]
      initGame() {
        // Generate a board
        this.game.makeBoard();
        // Post the board data to the API
        axios.post('/set/board', {
          room: this.room,
          board: JSON.stringify(this.game.board.tiles)
        }).then(() => {
          // Generate player order and order players accordingly
          let order = this.game.generateOrder();
          this.orderPlayers(order);
          // Send the start command to all clients
          this.game.startGame();
          // Start the game
          this.startGame();
        });
      },
      // Order local players [ran on all clients]
      orderPlayers(order) {
        // Assign play order to players
        for(let i = 0; i < order.length; i++) {
          let plyr = this.game.allPlayers.find(player => {
            return player.id === order[i].id
          });
          plyr.play_order = order[i].order;
        }
      },
      // Start the game [ran on all clients]
      startGame() {
        // Reset the local game state
        this.game.reset();
        // Countdown from 3
        // Load game board from API
        this.loadBoard();
        // Switch to playing state
        this.started = true;
        // Run the turn content
        this.game.nextTurn();
      },
      // Load the board from the API
      loadBoard() {
        axios.get('/fetch/board/'+this.room).then(res => {
          console.log(res.data);
          this.game.loadBoard(res.data);
        });
      },
      // Update the username and broadcast change to lobby
      updateUsername() {
        axios.post('/set/username', {
          name: this.user.name
        }).then(res => {
          this.connection.whisper('changedUsername', {id: this.user.id, name: this.user.name});
          this.game.allPlayers[0].name = this.user.name;
          this.editUsername = false;
        });
      },
      // Handle the action for a Card
      performCardAction(data) {
        this.game.performAction(data);
      }
    },
    destroyed() {
      this.presence.leave();
      this.connection.leave();
    }
  }
</script>

<style scoped>

</style>