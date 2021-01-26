require('./bootstrap');
import Vue from "vue";
import Player from '../../public/class/Player';

Vue.component('join-room', require('./components/join.vue').default);

new Vue({
  el: "#app"
});