<template>
  <div class="fixed flex inset-0 z-10 w-full h-full bg-black bg-opacity-60" id="cardBox">
<!--    <div class="h-full w-full z-0 card"></div>-->
    <div class="relative card m-auto">
      <img src="/assets/card.svg" class="z-0 w-full h-auto ml-2" alt="">
      <div class="h-auto p-12 pt-8 absolute inset-0 flex flex-col">
        <div class="bg-white rounded-lg shadow-xl cardHead" :style="{backgroundImage: 'url(\'/assets/situations/'+(Number(card.card.id) - 1)+'.png\')'}">
          <div class="p-4 bg-black bg-opacity-50 rounded-lg" >
            <img :src="'/assets/situations/'+(Number(card.card.id) - 1)+'.png'" class="shadow-lg mb-3" alt="">
            <h4 class="text-lg font-bold text-white">{{card.card.description}}</h4>
          </div>
        </div>

        <div class="flex-auto"></div>

        <div @click="choose(option)" class="text-sm cursor-pointer bottom-12 p-4 bg-white shadow-xl rounded-lg mt-4 bg-opacity-50 hover:bg-opacity-70" v-for="option in card.options">
          {{option.description}}
        </div>
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
    width: 33.333333%;
    max-width: 400px;
  }

  .cardHead {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>