<template>
  <div class="fixed flex inset-0 z-10 w-full h-full bg-black bg-opacity-60" id="cardBox">
    <div class="w-1/4 m-auto p-12 card">
      <div class="bg-white rounded-lg p-4 shadow-xl">
        {{card.card.description}}
      </div>

      <div @click="choose(option)" class="cursor-pointer p-4 bg-white border border-gray-100 shadow-xl rounded-lg mt-4" v-for="option in card.options">
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
  .card {
    background-image: url("../../../public/assets/card.svg");
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>