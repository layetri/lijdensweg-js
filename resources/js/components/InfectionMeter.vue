<template>
  <div id="infectionMeter">
    <div class="p-2 w-auto">
      <h4 class="h-4 font-bold mb-2">Infectiemeter</h4>
      <div class="h-4 w-full border border-gray-300 rounded">
        <div class="bg-blue-400 h-full rounded" :style="{width: amount+'%'}"></div>
      </div>

      {{title[amount - (amount % 20)]}}
    </div>
  </div>
</template>

<script>
export default {
  name: "InfectionMeter",
  props: {
    amount: Number
  },
  data() {
    return {
      title: {0: "Kerngezond", 20: "HATSJOE!", 40: "Flinke loopneus", 60: "Dat is geen hooikoorts!", 80: "Ach lag ik maar in bed", 100: "Doodziek"}
    }
  }
}
</script>

<style scoped>

</style>