<script>
  import { Card, Container, Tab, Tabs } from "svelte-chota";
  import createStore from "../store";
  import { onMount, setContext } from "svelte";
  import UserForm from "./UserForm.svelte";
  import UserFeeds from "./UserFeeds.svelte";

  const store = createStore();
  setContext("store", store);

  onMount(() => {
    store.restore();
  });

  let activeTab = "my";
</script>

<main>
  <Container>
    <Card>
      <UserForm />
      {#if $store.feeds.my && !$store.loading}
        <Tabs bind:active={activeTab} full>
          <Tab tabid="my">My Feeds</Tab>
          {#if $store.feeds.followers.length > 0}
            <Tab tabid="followers">Followers</Tab>
          {/if}
          {#if $store.feeds.following.length > 0}
            <Tab tabid="following">Following</Tab>
          {/if}
        </Tabs>
        {#if activeTab === "my"}
          <UserFeeds user={$store.feeds.my} />
        {/if}
        {#if activeTab === "followers"}
          {#each $store.feeds.followers as follower}
            <UserFeeds user={follower} />
          {/each}
        {/if}
        {#if activeTab === "following"}
          {#each $store.feeds.following as following}
            <UserFeeds user={following} />
          {/each}
        {/if}
      {/if}
    </Card>
  </Container>
</main>
