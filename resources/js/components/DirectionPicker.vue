<template>
  <div class="fixed h-full w-full inset-0 bg-black bg-opacity-50" id="directionPicker">
    <div id="rightBranch">Hier...</div>
    <div id="mainBranch">...hier...</div>
    <div id="leftBranch">...of hier?</div>
  </div>
</template>

<script>
  export default {
    name: "DirectionPicker",
    props: {
      directions: Array
    },
    methods: {
      pick(direction) {
        this.$emit('pick', direction);
      }
    }
  }
</script>

<style scoped>

</style>