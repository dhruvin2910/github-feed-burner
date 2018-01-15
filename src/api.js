import axios from 'axios'
import {extractDetails} from "./util";

export const baseUri = 'https://api.github.com'

function getFeeds(username) {
  return axios.get(`${baseUri}/users/${username}/events/public`)
    .then(({data: feeds}) => feeds.map((feed) => ({
      timestamp: feed.created_at,
      activity: feed.type.replace(/Event/, ''),
      details: extractDetails(feed)
    })))
}

function getUser(username) {
  return axios.get(`${baseUri}/users/${username}`)
    .then(({data: {login: username, avatar_url: avatarUrl}}) => ({username, avatarUrl}))
}

function getFollowers(username) {
  return axios.get(`${baseUri}/users/${username}/followers?per_page=100`)
    .then(({data: followers}) => followers.map(({login: username, avatar_url: avatarUrl}) => ({username, avatarUrl})))
}

function getFollowing(username) {
  return axios.get(`${baseUri}/users/${username}/following?per_page=100`)
    .then(({data: following}) => following.map(({login: username, avatar_url: avatarUrl}) => ({username, avatarUrl})))
}

export function getMyFeeds(username) {
  return Promise.all([getUser(username), getFeeds(username)])
    .then(([{username, avatarUrl}, feeds]) => ({username, avatarUrl, feeds}))
}

export function getFollowersFeeds(username) {
  return getFollowers(username)
    .then(followers =>
      Promise.all(followers.map(({username}) => getFeeds(username)))
        .then(followersFeeds => followers.map(({username, avatarUrl}, i) => ({
          username,
          avatarUrl,
          feeds: followersFeeds[i]
        }))))
}

export function getFollowingFeeds(username) {
  return getFollowing(username)
    .then(following =>
      Promise.all(following.map(({username}) => getFeeds(username)))
        .then(followingFeeds => following.map(({username, avatarUrl}, i) => ({
          username,
          avatarUrl,
          feeds: followingFeeds[i]
        }))))
}
