<template>
  <div id="mainWindow">
    <div class="container mx-auto py-9" v-if="!started">
      <div class="flex">
        <div class="w-1/4 p-4 bg-white border-gray-100 shadow rounded-lg">
          <b>Spelers in deze kamer</b>
          <div class="my-4">
            <div v-for="player in game.allPlayers">
              {{player.name}}
            </div>
          </div>

          <button class="text-sm py-2 px-4 bg-blue-400 text-white rounded-lg shadow">Nodig vrienden uit</button>
        </div>
        <div class="flex-auto text-center">
          <button class="text-2xl py-2 px-8 bg-blue-400 text-white rounded-xl shadow" @click="game.startGame()">start</button>
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
        connection: null,
        started: false
      }
    },
    created() {
      this.connection = Echo.channel(this.room);
      this.presence = Echo.join('presence-'+this.room)
          .joining((player) => {
            this.game.playerJoins(player);
          }).leaving((player) => {
            this.game.playerLeaves(player);
          }).here((players) => {
            for(let i = 0; i < players; i++) {
              this.game.playerJoins(players[i]);
            }
          });
      this.game.joinGame(this.connection);

      this.handleConnection();
      this.handleUIThread();
    },
    methods: {
      handleConnection() {
        this.connection.on('', () => {

        })
      },
      handleUIThread() {
        this.localBus.$on('startGame', this.startGame());
        this.localBus.$on('startGame', this.startGame());
      },
      startGame() {

      }
    }
  }
</script>

<style scoped>

</style>