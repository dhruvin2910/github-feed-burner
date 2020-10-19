const defaultPayload = {text: '', detail: '', link: ''}

function firstLine(text) {
  const nl = text.indexOf('\n');
  return nl > 0 ? text.slice(0, nl) : text
}

// TODO: Verify
export function extractDetails(feed) {
  const p = feed.payload
  switch (feed.type) {
    case 'CommitCommentEvent':
      return {text: firstLine(p.comment.body), detail: p.comment.body || '', link: p.comment.html_url}
    case 'CreateEvent':
    case 'DeleteEvent':
      return {
        text: p.ref_type === 'repository' ? feed.repo.name : `${feed.repo.name}/${p.ref}`,
        detail: p.description || '',
        link: `https://github.com/${feed.repo.name}`
      }
    case 'ForkEvent':
      return {text: feed.repo.name, detail: p.forkee.description || '', link: p.forkee.html_url}
    case 'GollumEvent':
      return {text: feed.repo.name, detail: '', link: `${feed.repo.url}/wiki`}
    case 'IssueCommentEvent':
      return {text: firstLine(p.comment.body), detail: p.comment.body, link: p.comment.html_url}
    case 'IssuesEvent':
      return {text: p.issue.title, detail: p.issue.body || '', link: p.issue.html_url}
    case 'MemberEvent':
      return {text: `${feed.repo.name}/${p.action}/${p.member.login}`, detail: '', link: feed.repo.url}
    case 'ProjectEvent':
      return {text: `${p.action} - ${p.project.name}`, detail: '', link: feed.repo.url}
    case 'PublicEvent':
      return {text: feed.repo.name, detail: '', link: feed.repo.url}
    case 'PullRequestEvent':
      return {text: `${p.action} - ${p.pull_request.title}`, detail: '', link: p.pull_request.html_url}
    case 'PullRequestReviewEvent':
      return {text: `${p.action} - ${firstLine(p.review.body)}`, detail: p.review.body || '', link: p.review.html_url}
    case 'PullRequestReviewCommentEvent':
      return {
        text: `${p.action} - ${firstLine(p.comment.body)}`,
        detail: p.comment.body || '',
        link: p.comment.html_url
      }
    case 'PushEvent':
      return {
        texts: p.commits.map(commit => firstLine(commit.message)),
        details: p.commits.map(commit => commit.message),
        links: p.commits.map(commit => `https://github.com/${feed.repo.name}/commit/${commit.sha}`),
        list: true
      }
    case 'ReleaseEvent':
      return {text: p.release.name, detail: p.release.body || '', link: p.release.html_url}
    case 'WatchEvent':
      return {text: feed.repo.name, detail: '', link: `https://github.com/${feed.repo.name}`}
    default:
      return defaultPayload
  }
}
