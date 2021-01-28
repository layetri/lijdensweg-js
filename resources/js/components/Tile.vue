<template>
  <div class="p-3" @click="status = true" :class="[status ? 'bg-green-400' : 'bg-'+tile.color+'-400']">
    <span>{{tile.xDist}}, {{tile.yDist}}</span><br>
    <small class="text-xs" v-if="tile.uuid">c: {{tile.uuid.substring(0, 7)}}</small><br>
    <small class="text-xs" v-if="tile.previousTiles.length > 0">p: {{tile.previousTiles[0].substring(0, 7)}}</small>
  </div>
</template>

<script>
  export default {
    name: "Tile",
    props: {
      tile: Object
    },
    data() {
      return {
        status: false
      }
    }
  }
</script>

<style scoped>

</style>