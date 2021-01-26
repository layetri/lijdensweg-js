<template>
  <div id="infectionMeter">
    <h5>{{amount}}</h5>
  </div>
</template>

<script>
export default {
  name: "InfectionMeter",
  props: {
    amount: Number
  }
}
</script>

<style scoped>

</style>