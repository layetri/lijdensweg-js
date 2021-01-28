<template>
  <div class="tileContainer" @click="status = true" :class="calculateContainerClasses()">
    <div class="tile border-blue-400 h-full w-full" :class="calculateTileClasses()">
      <span>{{tile.xDist}}, {{tile.yDist}}</span><br>
      <small class="text-xs" v-if="tile.uuid">c: {{tile.uuid.substring(0, 7)}}</small><br>
      <small class="text-xs" v-if="tile.previousTiles.length > 0">p: {{tile.previousTiles[0].substring(0, 7)}}</small>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Tile",
    props: {
      tile: Object,
      player: Object
    },
    data() {
      return {
        status: false
      }
    },
    methods: {
      calculateContainerClasses() {
        let str = '';

        if(this.tile.nextTiles.length === 1) {
          str += ' pt-6 pb-6';
        } else if(this.tile.nextTiles.length === 2) {
          str += ' pt-6';
        } else {

        }

        return str;
      },
      calculateTileClasses() {
        let str = '';

        // Conditional layout for:
        // - normal tile
        // - branch start tile top
        // - branch start tile bottom
        // - branch end tile top
        // - branch end tile bottom

        if(this.tile.uuid === this.player.currentTile.uuid) {
          str += 'bg-blue-200';
        } else {
          str += 'bg-gray-100';
        }

        if(this.tile.nextTiles.length === 1) {
          str += ' border-t-2 border-b-2';
        } else if(this.tile.nextTiles.length === 2) {

        } else {

        }

        return str;
      }
    }
  }
</script>

<style scoped>

</style>