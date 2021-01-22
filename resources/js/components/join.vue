<template>
  <div>
    <input type="text" placeholder="Room key" v-model="room">
    <button @click="joinRoom()">Join!</button>
  </div>
</template>

<script>
  export default {
    name: "RoomJoin",
    data() {
      return {
        room: null
      }
    },
    created() {

    },
    methods: {
      joinRoom() {

      }
    }
  }
</script>