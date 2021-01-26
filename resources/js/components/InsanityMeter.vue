<template>
  <div id="infectionMeter">
    <div class="p-2 w-auto">
      <h4 class="h-4 font-bold mb-2">Wappie-meter</h4>
      <div class="h-4 w-full border border-gray-300 rounded">
        <div class="h-full rounded"
             :class="[amount > 0 ? 'bg-red-400' : 'bg-green-400']"
             :style="{width: amount >= 0 ? amount+'%' : amount * -1+'%',
            marginLeft: amount > 0 ? '50%' : 50 + amount + '%'}">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InsanityMeter",
  props: {
    amount: Number
  }
}
</script>

<style scoped>

</style>