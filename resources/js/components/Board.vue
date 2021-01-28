<template>
  <div id="boardContainer">
    <tile
        v-for="tile in board.tiles"
        :player="players[0]"
        :key="tile.uuid"
        :tile="tile"
        class="tile"
        :style="{top: ((200 * tile.yDist) + 300)+'px', left: (200 * tile.xDist)+'px'}"></tile>

    <div v-for="player in players" class="player" :class="'bg-'+player.color+'-500'"></div>
  </div>
</template>

<script>
export default {
  name: "Board",
  props: {
    board: Object,
    players: Array
  }
}
</script>

<style scoped>
  #boardContainer {
    position: relative;
  }

  .player {
    border-radius: 50%;
    height: 10px;
    width: 10px;
  }

  .tile {
    position: absolute;
    float: left;
    width: 200px;
    height: 200px;
  }
</style>