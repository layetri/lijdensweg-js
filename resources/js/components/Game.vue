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
    <div class="overflow-auto h-full w-full" id="gameContainer" v-else>
      <div class="fixed z-10 top-6 left-6 w-1/5">
        <div class="w-full p-4">
          <div class="w-full p-4 pb-12 bg-gray-50 border-gray-100 shadow rounded-lg flex">
            <div class="flex-auto flex items-center">
              <h2 class="text-2xl font-black p-2">
                &euro;{{game.player.money}}
              </h2>

              <h5 class="text-lg font-bold" :class="[moneyMutation > 0 ? 'text-green-500' : 'text-red-500']" v-if="moneyMutation !== null">
                <span v-if="moneyMutation > 0">+</span><span v-else>-</span>&euro;{{moneyMutation > 0 ? moneyMutation : moneyMutation * -1}}
              </h5>
            </div>
            <div>
              <img :src="'/assets/dice/'+dice+'.png'" style="height: 50px; width: 50px;" v-if="diceFace === null && dice !== null">
            </div>
          </div>
        </div>


        <div style="margin-top: -4rem;" class="w-full p-4 bg-white border-gray-100 shadow-lg rounded-lg">
          <b>Spelers in deze kamer</b>
          <div class="my-4">
            <div :class="[[player.play_order === game.order_number ? 'font-bold' : 'text-gray-700'], 'text-'+player.color+'-500']" v-for="player in game.allPlayers">
              {{player.name}}
              <span class="text-gray-400" v-if="player.id === user.id">(jij)</span>
            </div>
          </div>
        </div>
      </div>

      <board :board="game.board" :players="game.allPlayers"></board>

<!--   Countdown UI element   -->
      <div class="fixed flex inset-0 w-full h-full z-10 bg-opacity-60 bg-black" v-if="countdown > 0">
        <h1 class="text-white text-9xl font-black">{{ countdown }}</h1>
      </div>

<!--   Direction Selector UI element   -->
      <direction-picker :directions="game.player.currentTile.nextTiles.length" v-if="game.junctionFlag" @pick="setDirection"></direction-picker>

<!--   Dice UI element   -->
      <div class="fixed flex inset-0 w-full h-full z-10 bg-opacity-60 bg-black" v-if="diceFace !== null">
        <img :src="'/assets/dice/'+diceFace+'.png'" class="m-auto w-1/4 h-auto">
      </div>

<!--   Card UI element   -->
      <card v-if="game.player.card !== null" :card="game.player.card" @perform="performCardAction"></card>

<!--   Start of Turn UI element   -->
      <div class="fixed flex inset-0 w-full h-full z-10 bg-opacity-60 bg-black" v-if="yourTurn">
        <h1 class="text-9xl font-black text-white m-auto">Je bent aan de beurt!</h1>
      </div>

<!--   End of Turn UI element   -->
      <div class="fixed flex inset-0 w-full h-full z-10 bg-opacity-60 bg-black" v-if="turnEnd !== null">
        <div class="w-2/3 relative m-auto">
          <h1 class="text-9xl font-black text-white m-auto">Je beurt is voorbij...</h1>
          <h3 class="text-4xl font-black text-gray-50 m-auto" v-if="game.player.insanity > 10">...en je hebt flink wat schade aangericht!</h3>
          <h3 class="text-4xl font-black text-gray-50 m-auto" v-else-if="-10 < game.player.insanity < 10">...en je doet het rustig aan!</h3>
          <h3 class="text-4xl font-black text-gray-50 m-auto" v-else-if="game.player.insanity < -10">...en je bent op het rechte pad gebleven!</h3>

          <div class="grid grid-cols-4 mb-12">
            <div v-for="action in turnEnd">
              <div class="p-6">
                <img :src="'/assets/items/'+elementIcons[action[1]]+'.svg'" alt="" v-if="!['item', 'buy'].includes(action[1])">
                <img :src="'/assets/items/'+action[3]+'.svg'" alt="" v-else>
              </div>
              <h4 class="text-lg font-black text-gray-400" v-if="action[0] === 'all'">iedereen</h4>
              <h4 class="text-lg font-black text-gray-400" v-else-if="action[0] === 'others'">alle anderen</h4>

              <h2 class="text-2xl font-black text-white" v-if="action[1] !== 'vaccinate'">
                {{elementTranslations[action[1]]}}
                <span :class="[['insanity', 'infection'].includes(action[1]) ? [action[2] < 0 ? 'text-green-500' : 'text-red-500'] : [action[2] > 0 ? 'text-green-500' : 'text-red-500']]">
                  {{action[2]}} <span v-if="action[3]">{{action[3]}}</span>
                </span>
              </h2>
              <h2 class="text-2xl font-black text-green-500" v-else>
                Je bent gevaccineerd!
              </h2>
            </div>
          </div>

          <button class="text-2xl px-4 py-2 rounded-xl mx-auto text-white bg-blue-500 cursor-pointer shadow-lg" @click="turnEnd = null">Okay!</button>
        </div>
      </div>

      <div class="w-full fixed bottom-0 left-0">
        <div class="w-3/4 p-4 flex items-center mx-auto rounded-t-xl bg-white shadow-xl">
          <button class="p-2 bg-blue-400 rounded-lg shadow diceBtn" v-if="game.player.play_order === game.order_number" @click="game.startTurn()" style="min-width: 4.5rem;">
            <img src="/assets/items/dice.svg" class="w-full cursor-pointer" alt="">
          </button>

          <div class="w-1/2 flex">
            <infection-meter class="w-1/2" :amount="game.player.infection"></infection-meter>
            <insanity-meter class="w-1/2" :amount="game.player.insanity"></insanity-meter>
          </div>

          <div class="w-1/2 flex" id="inventoryRow">
            <item v-for="item in game.player.items" :key="game.player.items.indexOf(item)" :item="item" @use="game.player.useItem(item.name)" @buy="game.player.buy(1, item.name)"></item>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import Game from "../../../public/class/Game";

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
        connection: null,
        started: false,
        dice: null,
        diceFace: null,
        animations: {dice: null, moneyMut: null, yourTurn: null, turnEnd: null},
        elementTranslations: {infection: "infectie", insanity: "wappie-heid", money: "geld", item: "items", buy: "items", move: "spelpositie", vaccinate: "gevaccineerd"},
        elementIcons: {infection: 'thermometer', insanity: 'virus', money: 'coin', item: 'backpack', move: 'steps', vaccinate: 'vaccine'},

        yourTurn: false,
        moneyMutation: null,
        turnEnd: null,
        countdown: 0
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
        }).listenForWhisper('playerMoving', data => {
          // Handle another player's movement
          this.game.handlePlayerMoving(data);
        }).listenForWhisper('playerFinished', data => {
          // Handle the end of another player's turn
          this.game.nextTurn();
        }).listenForWhisper('performAction', data => {
          // Handle actions that affect multiple players
          this.game.player.handleAction(data);
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
          this.diceFace = 1;
          this.game.animationBusy = true;

          let cnt = 0;
          this.animations.dice = setInterval(() => {
            if(cnt < 50) {
              this.diceFace = Math.round(Math.random() * 5) + 1;
              cnt++;
            } else {
              clearInterval(this.animations.dice);
              this.diceFace = this.dice;
              setTimeout(() => {
                this.diceFace = null;
                data.callback();
              }, 2000);
            }
          }, 50);
        });

        this.localBus.$on('modMoney', data => {
          clearTimeout(this.animations.moneyMut);
          this.moneyMutation = data;

          this.animations.moneyMut = setTimeout(() => {
            this.moneyMutation = null
          }, 2000);
        });

        this.localBus.$on('yourTurn', () => {
          clearTimeout(this.animations.yourTurn);
          this.turnEnd = null;
          this.yourTurn = true;

          this.animations.yourTurn = setTimeout(() => {
            this.yourTurn = false
          }, 2000);
        });

        this.localBus.$on('turnEnd', data => {
          this.turnEnd = data;
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
      returnToLobby() {
        this.started = false;
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
        // Load game board from API
        axios.get('/fetch/board/'+this.room).then(res => {
          this.game.loadBoard(res.data);
          // Reset the local game state
          this.game.reset();
          // Countdown from 3
          let int = setInterval(() => {
            if(this.countdown > 0) {
              this.countdown--;
            } else {
              clearInterval(int);
            }
          }, 1000);
          // Switch to playing state
          this.started = true;
          // Run the turn content
          this.game.nextTurn();
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
        this.game.endTurn();
      },
      // Set the user-picked direction
      setDirection(direction) {
        this.game.chosenTile = direction;
        this.game.junctionFlag = false;
        this.game.pauseMoving = false;
      }
    },
    destroyed() {
      this.presence.leave();
      this.connection.leave();
    }
  }
</script>

<style scoped>
  #gameContainer::-webkit-scrollbar {
    display: none;
  }

  #gameContainer {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .diceBtn {
    max-width: 4rem;
  }
</style>