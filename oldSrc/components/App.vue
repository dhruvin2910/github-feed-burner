<template>
  <b-container class="gfb-container">
    <b-card title="Github Feed Burner">
      <user-form @submit="setUsername"/>
      <b-tabs v-if="feeds.my && !loading">
        <b-tab title="My Feeds" active>
          <user-feeds :user="feeds.my"/>
        </b-tab>
        <b-tab title="Followers" v-if="feeds.followers.length > 0">
          <user-feeds v-for="follower in feeds.followers" :user="follower" :key="follower.username"/>
        </b-tab>
        <b-tab title="Following" v-if="feeds.following.length > 0">
          <user-feeds v-for="following in feeds.following" :user="following" :key="following.username"/>
        </b-tab>
      </b-tabs>
    </b-card>
  </b-container>
</template>

<script>
  import UserForm from './UserForm'
  import UserFeeds from './UserFeeds'
  import {mapActions, mapState} from 'vuex'

  export default {
    components: {UserForm, UserFeeds},
    name: 'app',
    computed: mapState(['username', 'loading', 'feeds']),
    methods: mapActions(['setUsername'])
  }
</script>

<style>

  body {
    background-color: #262621;
  }

  .gfb-container {
    background-color: #262621;
  }

  .card {
    background-color: #262621;
    border-color: #323232;
  }

  .card-title {
    color: #6BE5F2;
    text-align: center;
    font-size: 30px;
  }

  .nav {
    background-color: #323232;
  }

  .nav:focus {
    outline: none;
  }

  .nav-tabs {
    border-color: #6BE5F2;
  }

  .nav-tabs .nav-link {
    text-decoration: none;
    color: #6BE5F2;
  }

  .nav-tabs .nav-link:hover, .nav-tabs .nav-link:focus {
    border-color: #6BE5F2 #6BE5F2;
    color: #6BE5F2;
  }

  .nav-tabs .nav-link:focus, .nav-tabs .nav-link.active {
    color: #262621;
    background-color: #6BE5F2;
    border-color: #6BE5F2 #6BE5F2;
  }

  .tab-content .card {
    margin: 8px 0;
  }

</style>
