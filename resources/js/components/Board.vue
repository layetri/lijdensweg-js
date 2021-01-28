<template>
  <div id="boardContainer">
    <tile
        v-for="tile in board.tiles"
        :key="tile.uuid"
        :tile="tile"
        class="tile"
        :style="{top: (100 * tile.yDist)+'px', left: (100 * tile.xDist)+'px'}"></tile>
  </div>
</template>

<script>
export default {
  name: "Board",
  props: {
    board: Object
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
    width: 100px;
    height: 100px;
  }
</style>