<template>
  <b-container>
    <b-card header="Github Feed Burner">
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
