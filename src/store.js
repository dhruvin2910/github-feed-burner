import { writable } from "svelte/store";
import * as api from "./api";
import netlify from "netlify-auth-providers";
import * as packageJson from "../package.json";

const Authenticator = netlify.default;
const auth = new Authenticator({ site_id: packageJson.netlify.siteId });

export default () => {
  const initialState = {
    username: "",
    token: null,
    loading: false,
    feeds: {
      my: null,
      followers: [],
      following: []
    }
  };
  const { subscribe, set, update } = writable(initialState);
  const reset = () => set(initialState);
  const setUsername = (username = "") => update(state => ({ ...state, username }));
  const setToken = (token) => {
    api.setToken(token);
    update(state => ({ ...state, token }));
  };
  const setLoading = loading => update(state => ({ ...state, loading }));
  const setFeeds = feeds => update(state => ({ ...state, feeds }));
  const save = ({ username, token }) => {
    try {
      window.localStorage.setItem("username", username);
      window.localStorage.setItem("token", token);
    } catch (e) {
      console.error(e);
    }
  };
  const restore = () => {
    try {
      setUsername(window.localStorage.getItem("username"));
      setToken(window.localStorage.getItem("token")); // todo: handle token expiry
    } catch (e) {
      console.error(e);
    }
  };
  const login = () => {
    // noinspection JSUnresolvedFunction
    auth.authenticate({ provider: "github" }, (error, { token }) => {
      if (error) return alert(error);
      setToken(token);
    });
  };
  return {
    subscribe,
    setUsername,
    restore,
    reset,
    login,
    fetch() {
      subscribe(async state => {
        if (state.loading) return;
        save(state);
        try {
          setLoading(true);
          const [my, followers, following] = await Promise.all([
            api.getMyFeeds(state.username),
            api.getFollowersFeeds(state.username),
            api.getFollowingFeeds(state.username)
          ]);
          setFeeds({ my, followers, following });
        } catch (error) {
          alert(error);
          reset();
          restore();
        } finally {
          setLoading(false);
        }
      })();
    }
  };
}
