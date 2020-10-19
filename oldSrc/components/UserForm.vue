<template>
  <b-form @submit.prevent="onSubmit">
    <b-form-input type="text" size="sm" v-model="username" placeholder="Username" :disabled="loading"
                  autofocus class="gfb-input"></b-form-input>
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

<style>
  .gfb-input, .gfb-input:focus, .gfb-input:disabled {
    background-color: #262621;
    color: #FFFFFF;
    margin: 4px 0 16px 0;
    width: 50vw;
  }

  .gfb-input:focus {
    box-shadow: 0 0 0 0.1rem rgba(107, 229, 242, 0.2);
    border-color: #6BE5F2;
  }

  .gfb-input:disabled {
    opacity: 0.4;
  }

  form {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
