import Vue from 'vue'
import store from './store'
import './bootstrap-vue'
import App from './components/App'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  store,
  components: {App},
  template: '<app/>'
})
