<template>
  <div id="boardContainer">
    <tile
        v-for="tile in board.tiles"
        :player="players[0]"
        :key="tile.uuid"
        :tile="tile"
        class="tile"
        :style="{top: ((200 * tile.yDist) + 300)+'px', left: (200 * tile.xDist)+'px'}"></tile>
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

  .tile {
    position: absolute;
    float: left;
    width: 200px;
    height: 200px;
  }
</style>