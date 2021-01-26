<template>
  <div>
    <div class="w-full flex">
      <div class="flex-auto"></div>
      <div class="flex-grow-0 px-4 py-2" v-if="user !== null">
        {{user.name}}
        <span class="text-gray-700" v-if="room !== null">@ {{room}}</span>
      </div>
    </div>
    <div v-if="joined">
      <game :room="room" :user="user"></game>
    </div>
    <div class="container mx-auto py-5" v-else>
      <h1 class="text-6xl text-center">Lijdensweg</h1>
      <join-room @joined="joinRoom"></join-room>
    </div>
  </div>
</template>

<script>
export default {
  name: "game-container",
  data() {
    return {
      joined: false,
      room: null,
      user: null
    }
  },
  created() {
    axios.get('/fetch/init_data').then(res => {
      this.user = res.data.user;
    });
  },
  methods: {
    joinRoom(room_id) {
      axios.post('/join?room='+room_id).then(res => {
        this.user = res.data.user;
        this.room = res.data.room;
        this.joined = true;
      });
    }
  }
}
</script>

<style scoped>

</style>