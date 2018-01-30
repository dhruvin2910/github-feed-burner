import Vue from 'vue'
import App from './components/App'
import store from './store'
import './bootstrap-vue'
import './style.css'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  store,
  components: {App},
  template: '<app/>'
})
