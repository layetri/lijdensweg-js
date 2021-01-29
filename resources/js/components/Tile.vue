<template>
  <div class="tileContainer" @click="status = true" :class="[tile.type+'-p', player.currentTile.uuid === tile.uuid ? 'border-2 border-blue-400' : '']">
    <div class="tile h-full w-full p-2" :class="[tile.type+'-b', ['startTile', 'finishTile'].includes(tile.type) ? 'bg-'+tile.color+'-500 border-'+tile.color+'-700 white-text' : 'bg-'+tile.color+'-100 border-'+tile.color+'-500']">
      <span>{{tile.xDist}}, {{tile.yDist}} <b>[{{tile.type}}]</b></span><br>
      <div v-for="person in tile.players">
        {{person.name}}
      </div>
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

    }
  }
</script>

<style scoped>
  .tileContainer {
    width: 200px;
    height: 200px;
  }

  .path-p {
    padding: 1.5rem 0 1.5rem 0;
  }
  .path-b {
    border-width: 2px 0 2px 0;
  }

  .startTile-p {
    padding: 1.5rem 0 1.5rem 1.5rem;
  }
  .startTile-b {
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
    border-width: 2px 0 2px 2px;
  }

  .finishTile-p {
    padding: 1.5rem 1.5rem 1.5rem 0;
  }
  .finishTile-b {
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
    border-width: 2px 2px 2px 0;
  }

  .qJunc-p {
    padding: 0;
  }
  .qJunc-b {
    border-width: 0 2px 0 2px;
  }

  .tJunc-p {
    padding: 1rem 0 0 0;
  }
  .tJunc-b {
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    border-width: 2px 2px 0 2px;
  }

  .tJunc-i-p {
    padding: 0 0 1rem 0;
  }
  .tJunc-i-b {
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
    border-width: 0 2px 2px 2px;
  }

  .branchStart-p, .branchEnd-p {
    padding: 0 0 1.5rem 0;
  }
  .branchStart-b {
    border-bottom-left-radius: 1.5rem;
    border-width: 0 2px 2px 2px;
  }
  .branchEnd-b {
    border-bottom-right-radius: 1.5rem;
    border-width: 0 2px 2px 2px;
  }

  .branchStart-t-p, .branchEnd-t-p {
    padding: 1.5rem 0 0 0;
  }
  .branchStart-t-b {
    border-top-left-radius: 1.5rem;
    border-width: 2px 2px 0 2px;
  }
  .branchEnd-t-b {
    border-top-right-radius: 1.5rem;
    border-width: 2px 2px 0 2px;
  }
</style>