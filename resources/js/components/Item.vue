<template>
  <div class="p-2 flex-auto m-2 rounded-lg shadow text-white" :class="[isRed ? 'bg-red-500' : [item.amount > 0 ? 'bg-blue-500' : 'bg-blue-300']]">
    <span class="cursor-pointer" @click="use()">
      <img :src="'/assets/items/'+item.icon+'.svg'" alt="">
      {{item.name}} <small>{{item.amount}}</small>
    </span>
    <span class="cursor-pointer" @click="buy()">get</span>
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