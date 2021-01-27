<template>
  <div class="flex-auto m-2 rounded-lg shadow text-white" :class="[isRed ? 'bg-red-500' : [item.amount > 0 ? 'bg-blue-500' : 'bg-blue-300']]">
    <div class="relative">
      <img @click="use()" :src="'/assets/items/'+item.icon+'.svg'" class="w-full cursor-pointer" alt="">
      <div class="absolute w-full text-center bottom-0 rounded-b-lg z-10 bg-gray-600 bg-opacity-50">
        <small class="text-lg font-bold">{{item.amount}}</small>
        <span class="cursor-pointer text-gray-100 font-light text-sm" @click="buy()">get</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Item",
    props: {
      item: Object
    },
    data() {
      return {
        isRed: false
      }
    },
    methods: {
      buy() {
        if(this.item.buyable) {
          this.$emit('buy');
        }
      },
      use() {
        if(this.item.amount > 0) {
          this.$emit('use');
        } else {
          this.isRed = true;
          setTimeout(() => {
            this.isRed = false;
          }, 1000);
        }
      }
    }
  }
</script>

<style scoped>

</style>