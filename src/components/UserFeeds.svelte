<!--suppress HtmlUnknownTarget -->
<script>
  import { Card, Row, Col } from "svelte-chota";
  import marked from "marked";

  export let user;

  const time = text => {
    return new Date(text).toDateString();
  };

  const markdown = text => {
    return text ? marked(text) : "";
  };
</script>

<Card header-tag="header">
  <div slot="header">
    <Row>
      <Col><img src={user.avatarUrl} class="avatar" alt="Avatar"></Col>
      <Col><a href={`https://github.com/${user.username}`} target="_blank">{ user.username }</a></Col>
    </Row>
  </div>
  {#if user.feeds.length > 0}
    <table>
      <thead>
      <tr>
        <th>Timestamp</th>
        <th>Details</th>
      </tr>
      </thead>
      <tbody>
      {#each user.feeds as feed, feedIndex}
        <tr>
          <td>{time(feed.timestamp)}</td>
          <td class="contains-icons">
            {#if feed.details.list}
              {#each feed.details.links as link, linkIndex}
                <a href={link}>{@html markdown(feed.details.texts[linkIndex])}</a>
                <!--todo: popover for details-->
              {/each}
            {:else}
              <a href={feed.details.link}>{@html markdown(feed.details.text)}</a>
              <!--todo: popover for details-->
            {/if}
          </td>
        </tr>
      {/each}
      </tbody>
    </table>
  {:else}
    No recent activity.
  {/if}
</Card>

<style>
    .avatar {
        width: 48px;
        height: 48px;
    }

    .contains-icons :global(img) {
        max-width: 24px;
        max-height: 24px;
    }
</style>
