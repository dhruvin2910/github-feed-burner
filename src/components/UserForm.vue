<template>
  <b-form @submit.prevent="onSubmit">
    <b-form-input type="text" size="sm" v-model="username" placeholder="Username" :disabled="loading"
                  autofocus></b-form-input>
  </b-form>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: 'user-form',
    data() {
      return {username: ''}
    },
    computed: mapState(['loading']),
    mounted() {
      if (localStorage && (this.username = localStorage.getItem('username') || ''))
        this.$store.dispatch('setUsername', this.username)
    },
    methods: {
      onSubmit() {
        if (localStorage) localStorage.setItem('username', this.username)
        this.$store.dispatch('setUsername', this.username)
      }
    }
  }
</script>
