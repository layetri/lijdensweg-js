<template>
  <div id="mainWindow">

  </div>
</template>

<script>
export default {
  name: "Game",
  data() {
    return {
      game: new Game(),
      connection: null,
      localBus: new Vue()
    }
  },
  created() {
    this.connection = Echo.private('1234');
    this.presence = Echo.join('presence-1234')
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
  },
  methods: {
    handleConnection() {
      this.connection.on('', () => {

      })
    }
  }
}
</script>

<style scoped>

</style>