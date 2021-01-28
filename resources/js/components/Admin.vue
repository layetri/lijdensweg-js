<template>
  <div id="adminView">
    <div class="w-full h-full flex">
      <div class="bg-white rounded-xl shadow-xl p-12 m-auto w-2/3">
        <h4 class="text-2xl">Admin panel.</h4>
        <p class="text-blue-500 mb-2" v-if="situations !== null">Current count: {{situations.length}}</p>

        <div class="max-h-40 overflow-y-auto mb-3">
          <div class="p-2 m-1 bg-gray-100 rounded" v-for="situation in situations">
            {{situation.id}} {{situation.description}}
          </div>
        </div>

        <div class="p-6 bg-blue-50 rounded-xl">
          <h2 class="text-lg mb-4">Add a new one.</h2>

          <div class="flex p-2">
            <input type="text" class="input flex-auto mr-6" placeholder="description" v-model="newSituation.description">
            <label>
              <small>Minimum turn number:</small>
              <input type="number" class="input" v-model="newSituation.min_turn" min="1" max="50">
            </label>
          </div>

          <hr class="my-4">
          <div class="bg-black bg-opacity-5 p-4">
            <h6 class="text-blue-500 mt-2">Options</h6>

            <div>
              <div v-for="option in newSituation.options">
                {{option.description}}
              </div>
            </div>

            <div class="p-2">
              <input type="text" class="input w-full mr-6" placeholder="description" v-model="newOption.description" @keydown.enter="addOption">
            </div>
            <div class="flex p-2">
              <input type="text" v-model="newOption.action" placeholder="actions" class="w-2/3 mr-6 input" @keydown.enter="addOption">

              <label class="w-1/3 flex items-center">
                <small>Sanity range:</small>
                <select v-model="newOption.sanity" class="input flex-auto">
                  <option :value="value" v-for="(value, key) in sanityOptions">{{key}}</option>
                </select>
              </label>
            </div>
          </div>
          <hr class="my-4">

          <button class="px-4 py-2 rounded-lg bg-blue-400 text-white" @click="save()">Create</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Admin",
  data() {
    return {
      situations: null,
      newSituation: {description: null, min_turn: 1, options: []},
      newOption: {description: null, sanity: [-50, 50], action: ""},
      sanityOptions: {all: [-50, 50], wappie_extreem: [25, 50], wappie_normaal: [10, 50], normaal_wappie: [-15, 25], normaal_heilig: [-25, 10], heilig_normaal: [-50, -15], heilig_extreem: [-50, -25]}
    }
  },
  created() {
    axios.get('/admin/situations').then(res => {
      this.situations = res.data;
    });
  },
  methods: {
    addOption() {
      this.newOption.action = '[' + this.newOption.action + ']';
      this.newSituation.options.push(this.newOption);
      this.newOption = {description: null, sanity: [], action: ""};
    },
    save() {
      axios.post('/admin/situation', {
        situation: this.newSituation
      }).then(res => {
        this.situations.push(res.data);
        this.newSituation = {description: null, min_turn: 1, options: []};
      });
    }
  }
}
</script>

<style scoped>
  .input {
    padding: 4px;
    border-radius: 10px;
    border: 1px solid lightgrey;
  }
</style>