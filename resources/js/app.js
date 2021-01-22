require('./bootstrap');
import Vue from "vue";

Vue.component('join-room', require('./components/join.vue').default);

new Vue({
  el: "#app"
});