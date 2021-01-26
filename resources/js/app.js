require('./bootstrap');
import Vue from "vue";

Vue.component('game-container', require('./components/main.vue').default);
Vue.component('join-room', require('./components/join.vue').default);
Vue.component('game', require('./components/Game.vue').default);
Vue.component('board', require('./components/Board.vue').default);
Vue.component('tile', require('./components/Tile.vue').default);
Vue.component('card', require('./components/Card.vue').default);
Vue.component('item', require('./components/Item.vue').default);
Vue.component('infection-meter', require('./components/InfectionMeter.vue').default);
Vue.component('insanity-meter', require('./components/InsanityMeter.vue').default);
Vue.component('dialog-box', require('./components/DialogBox.vue').default);

new Vue({
  el: "#app"
});