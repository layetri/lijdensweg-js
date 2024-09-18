<template>
  <div id="joinRoomWizard">
    <div class="py-4 w-2/3 mx-auto" v-if="errors.length > 0">
      <div class="bg-red-100 rounded-lg border border-red-300 text-red-500 px-4 py-2 mb-2" v-for="error in errors" :key="errors.indexOf(error)">{{error}}</div>
    </div>

    <div class="p-4 w-full flex divide-x divide-blue-300">
      <div class="w-1/2 p-9 text-right">
        <div class="w-2/3 ml-auto mb-8 text-left">
          <div class="mb-2 px-4 py-2 bg-white border border-grey-100 rounded shadow cursor-pointer" @click="joinRoom(true, room)" v-for="room in rooms" :key="rooms.indexOf(room)">
            {{room}}
          </div>
        </div>

        <input class="px-4 py-2 rounded-lg border border-blue-400" type="text" placeholder="Kamercode" v-model="room">
        <button class="px-4 py-2 rounded-lg bg-blue-400 text-white" @click="joinRoom(true)">Meedoen!</button>
      </div>
      <div class="w-1/2 p-9">
        <button class="px-4 py-2 rounded-lg bg-blue-400 text-white" @click="joinRoom(false)">Maak een kamer</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "RoomJoin",
    data() {
      return {
        room: null,
        rooms: [],
        errors: []
      }
    },
    created() {
      axios.get('/fetch/rooms').then(res => {
        this.rooms = res.data;
      });
    },
    methods: {
      joinRoom(validate, room = null) {
        if(room !== null) {
          this.room = room;
        }
        if(validate && ![null, ''].includes(this.room) || !validate) {
          this.$emit('joined', this.room);
        } else {
          this.errors.push('Room key cannot be empty.');
        }
      }
    }
  }
</script>