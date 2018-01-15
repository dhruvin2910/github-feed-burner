import Vue from 'vue'
import Vuex from 'vuex'
import {getFollowersFeeds, getFollowingFeeds, getMyFeeds} from './api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: '',
    loading: false,
    feeds: {
      my: null,
      followers: [],
      following: []
    }
  },
  actions: {
    setUsername({commit, dispatch}, username) {
      if (username) {
        commit('setUsername', username)
        commit('setLoading', true)
        return Promise.all([
          dispatch('getMyFeeds'),
          dispatch('getFollowersFeeds'),
          dispatch('getFollowingFeeds')
        ]).catch(error => {
          console.error(error)
          dispatch('resetStore')
        }).finally(() => commit('setLoading', false))
      } else return dispatch('resetStore')
    },
    getMyFeeds({state, commit}) {
      return getMyFeeds(state.username).then(feeds => commit('setMyFeeds', feeds))
    },
    getFollowersFeeds({state, commit}) {
      return getFollowersFeeds(state.username).then(feeds => commit('setFollowersFeeds', feeds))
    },
    getFollowingFeeds({state, commit}) {
      return getFollowingFeeds(state.username).then(feeds => commit('setFollowingFeeds', feeds))
    },
    resetStore({commit}) {
      commit('setUsername', '')
      commit('setMyFeeds', null)
      commit('setFollowersFeeds', [])
      commit('setFollowingFeeds', [])
    }
  },
  mutations: {
    setUsername(state, username) {
      state.username = username
    },
    setLoading(state, loading) {
      state.loading = loading
    },
    setMyFeeds(state, feeds) {
      state.feeds.my = feeds
    },
    setFollowersFeeds(state, feeds) {
      state.feeds.followers = feeds
    },
    setFollowingFeeds(state, feeds) {
      state.feeds.following = feeds
    }
  }
})
