import axios from "axios";
import { extractDetails } from "./util";

const baseUri = "https://api.github.com";
const perPage = 100;

let tokenInterceptorId = null;

export function setToken(token) {
  if (tokenInterceptorId) {
    axios.interceptors.request.eject(tokenInterceptorId);
    tokenInterceptorId = null;
  }
  if (token) {
    tokenInterceptorId = axios.interceptors.request.use(req => {
      req.headers["Authorization"] = `token ${token}`;
      return req;
    });
  }
}

function getFeeds(username) {
  return axios.get(`${baseUri}/users/${username}/events/public`)
    .then(({ data: feeds }) => feeds.map((feed) => ({
      timestamp: feed.created_at,
      activity: feed.type.replace(/Event/, ""),
      details: extractDetails(feed)
    })));
}

function getUser(username) {
  return axios.get(`${baseUri}/users/${username}`)
    .then(({ data: { login: username, avatar_url: avatarUrl } }) => ({ username, avatarUrl }));
}

function getFollowers(username) {
  return axios.get(`${baseUri}/users/${username}/followers?per_page=${perPage}`)
    .then(({ data: followers }) => followers.map(({ login: username, avatar_url: avatarUrl }) => ({
      username,
      avatarUrl
    })));
}

function getFollowing(username) {
  return axios.get(`${baseUri}/users/${username}/following?per_page=${perPage}`)
    .then(({ data: following }) => following.map(({ login: username, avatar_url: avatarUrl }) => ({
      username,
      avatarUrl
    })));
}

export function getMyFeeds(username) {
  return Promise.all([getUser(username), getFeeds(username)])
    .then(([{ username, avatarUrl }, feeds]) => ({ username, avatarUrl, feeds }));
}

export function getFollowersFeeds(username) {
  return getFollowers(username)
    .then(followers =>
      Promise.all(followers.map(({ username }) => getFeeds(username)))
        .then(followersFeeds => followers.map(({ username, avatarUrl }, i) => ({
          username,
          avatarUrl,
          feeds: followersFeeds[i]
        }))));
}

export function getFollowingFeeds(username) {
  return getFollowing(username)
    .then(following =>
      Promise.all(following.map(({ username }) => getFeeds(username)))
        .then(followingFeeds => following.map(({ username, avatarUrl }, i) => ({
          username,
          avatarUrl,
          feeds: followingFeeds[i]
        }))));
}


export function rateLimit() {
  return axios.get(`${baseUri}/rate_limit`);
}
