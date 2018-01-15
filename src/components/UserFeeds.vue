<template>
  <b-card header-tag="header">
    <div slot="header">
      <b-row>
        <b-col cols="auto"><img :src="user.avatarUrl" class="rounded-circle avatar" alt="Avatar"></b-col>
        <b-col><a :href="`https://github.com/${user.username}`" target="_blank">{{user.username}}</a></b-col>
      </b-row>
    </div>
    <div v-if="user.feeds.length > 0">
      <b-table :items="user.feeds" bordered responsive>
        <template slot="timestamp" slot-scope="data">{{time(data.value)}}</template>
        <template slot="details" slot-scope="data">
          <div v-if="data.value.list">
            <div v-for="(link, index) in data.value.links">
              <b-link :href="link" :id="`${user.username}-${data.index}-${index}`"
                      v-html="marked(data.value.texts[index])" target="_blank"></b-link>
              <b-popover v-if="data.value.details[index]" :target="`${user.username}-${data.index}-${index}`"
                         triggers="hover">
                <div v-html="marked(data.value.details[index])"></div>
              </b-popover>
            </div>
          </div>
          <div v-else>
            <b-popover v-if="data.value.detail" :target="`${user.username}-${data.index}`" triggers="hover">
              <div v-html="marked(data.value.detail)"></div>
            </b-popover>
            <b-link :href="data.value.link" :id="`${user.username}-${data.index}`"
                    v-html="marked(data.value.text)" target="_blank"></b-link>
          </div>
        </template>
      </b-table>
    </div>
    <div v-else>
      No recent activity.
    </div>
  </b-card>
</template>

<script>
  import marked from "marked";

  export default {
    props: {user: Object},
    name: 'user-feeds',
    methods: {
      time(text) {
        return new Date(text).toDateString()
      },
      marked(text) {
        return text ? marked(text) : ''
      }
    }
  }
</script>

<style>
  p {
    margin: 0 !important;
  }

  .avatar {
    width: 48px;
    height: 48px;
  }
</style>
