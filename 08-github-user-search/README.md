# Project 8 — GitHub User Search

**Difficulty:** Intermediate
**Concepts:** a REAL live external API, dependency injection for testability, reused debounce + race-safety patterns.

## Folder structure
```
08-github-user-search/
├── GitHubUserSearch.jsx      Debounced search + race-safe fetch
├── GitHubUserSearch.test.jsx 5 tests: 4 mocked/deterministic, 1 genuinely LIVE
├── githubApi.js              Real fetch() to api.github.com, response.ok checked
└── useDebouncedValue.js      Reused from Project 4
```

## Dependency injection for testability

```js
function GitHubUserSearch({ fetchUser = realFetchGitHubUser }) { ... }
```
Tests pass a controllable mock (`vi.fn().mockResolvedValue(...)`); production
code never passes this prop, so the real API is always used. This lets timing-
sensitive scenarios (like a race condition) be tested DETERMINISTICALLY with
`mockImplementationOnce` controlling exact resolve order and delay, rather
than hoping real network timing cooperates.

## The live test result, honestly reported

This course's Snippet 26 exhausted GitHub's unauthenticated rate limit early
on. The one genuinely live test in this file (no injected mock) hit that SAME
still-exhausted limit and correctly displayed an error state instead of
crashing — proof that resilient error handling holds up against real,
persistent failure, not just a hypothetical one.

## `githubApi.js` — the response.ok discipline

```js
export async function fetchGitHubUser(username) {
  const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);
  if (!response.ok) {
    throw new HttpError(`${response.status} ${response.statusText}`, response.status);
  }
  return response.json();
}
```
`fetch()` never throws for HTTP error statuses (404, 403, 500) — only for true
network failures. Skipping the `response.ok` check means an error PAYLOAD gets
silently treated as if it were real user data.
