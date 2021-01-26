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
    <div v-else>
      <board></board>
      <infection-meter :amount="game.player.infection"></infection-meter>
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
        game: new Game(this.user, this.localBus),
        editUsername: false,
        board: null,
        connection: null,
        started: false
      }
    },
    created() {
      this.connection = Echo.private('room.'+this.room);
      this.presence = Echo.join('presence.'+this.room)
          .here((players) => {
            console.log(players);
            for(let i = 0; i < players.length; i++) {
              if(players[i].id !== this.user.id) {
                this.game.playerJoins(players[i]);
              }
            }
          }).joining((player) => {
            this.game.playerJoins(player);
          }).leaving((player) => {
            this.game.playerLeaves(player);
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
          console.log('Game started!');
          console.log(data);
          this.startGame();
        }).listenForWhisper('playerFinished', data => {
          console.log('player finished their turn');
          console.log(data);
        }).listenForWhisper('receivedChat', data => {
          console.log(data);
        }).listenForWhisper('changedUsername', data => {
          let user = this.game.allPlayers.findIndex(player => {
            return player.id === data.id;
          });

          this.game.allPlayers[user].name = data.name;
        });
      },
      handleUIThread() {
        //this.localBus.$on('startGame', this.startGame());
      },
      initGame() {
        axios.get('/generate/board/'+this.room).then(res => {
          console.log(res.data);
          this.game.startGame();
          this.startGame();
        });
      },
      startGame() {
        // Countdown from 3
        // Switch to playing state
        // Load game board from API
        this.loadBoard();
      },
      loadBoard() {
        axios.get('/fetch/board/'+this.room).then(res => {
          this.board = new Board(res.data.board);
        });
      },
      updateUsername() {
        axios.post('/set/username', {
          name: this.user.name
        }).then(res => {
          this.connection.whisper('changedUsername', {id: this.user.id, name: this.user.name});
          this.game.allPlayers[0].name = this.user.name;
          this.editUsername = false;
        });
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