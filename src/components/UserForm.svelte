<script>
  import { getContext } from "svelte";
  import { Row, Input, Button } from "svelte-chota";

  const store = getContext("store");

  const onSubmit = e => {
    e.preventDefault();
    store.fetch();
  };
</script>

<Row>
  <Button on:click={() => store.login()} disabled={$store.token}>{$store.token ? "Logged In" : "Login"}</Button>
  <form on:submit={onSubmit}>
    <Input
      title="Username" type="text" placeholder="Username"
      disabled={$store.loading} autofocus value={$store.username}
      on:change={e => store.setUsername(e.target.value)} />
  </form>
</Row>
