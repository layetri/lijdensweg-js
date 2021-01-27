<template>
  <div class="fixed inset-0 z-10 w-full h-full bg-gray-500 bg-opacity-50" id="cardBox">
    <div class="m-auto w-1/2 h-auto p-5 bg-white rounded-lg shadow">
      {{card.card.description}}

      <div @click="choose(option)" class="cursor-pointer p-4 border border-gray-100 shadow rounded-lg mt-4" v-for="option in card.options">
        {{option.description}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: {
    card: Object
  },
  methods: {
    show() {

    },
    hide() {

    },
    choose(option) {
      this.$emit('perform', option);
    }
  }
}
</script>

<style scoped>

</style>