<template>
  <div class="fixed flex flex-col h-full w-full inset-0 bg-black bg-opacity-60 z-20" id="directionPicker">
    <div id="rightBranch" class="m-auto p-6 w-max text-center" @click="pick(2)" v-if="directions > 2">
      <div class="p-2 bg-white cursor-pointer">Hier...</div>
    </div>

    <div class="w-full flex-auto flex">
      <div class="centerText m-auto flex-auto text-9xl font-black text-white">Waar wil je heen?</div>

      <div id="mainBranch" class="my-auto p-6 text-center" @click="pick(0)">
        <div class="p-2 bg-white cursor-pointer w-auto">...hier...</div>
      </div>
    </div>

    <div id="leftBranch" class="m-auto p-6 w-max text-center" @click="pick(1)" v-if="directions > 1">
      <div class="p-2 bg-white cursor-pointer">...of hier?</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "DirectionPicker",
    props: {
      directions: Number
    },
    methods: {
      pick(direction) {
        this.$emit('pick', direction);
      }
    }
  }
</script>

<style scoped>
  #rightBranch {

  }

  #leftBranch {

  }

  #mainBranch {

  }
</style>