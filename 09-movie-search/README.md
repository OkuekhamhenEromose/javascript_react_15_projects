# Project 9 — Movie Search Application

**Difficulty:** Intermediate
**Concepts:** pagination, and the FOURTH UI state (`empty`, distinct from `error`).

**Mock API disclosure:** no movie API is reachable from this sandbox's
network allowlist. `mockMovieApi.js` is a clearly labeled mock with a
realistic paginated dataset (11 movies, page size 3).

## Folder structure
```
09-movie-search/
├── MovieSearch.jsx          idle/loading/error/empty/success states + pagination
├── MovieSearch.test.jsx     4 tests, incl. the CRITICAL page-reset test
├── MovieSearchBuggy.jsx     Missing the page-reset effect (intentional bug)
├── MovieSearchBuggy.test.jsx PROVES "Page 2 of 1" - a broken pagination state
├── MovieCard.jsx            Reusable card
└── mockMovieApi.js          Mock API, clearly labeled
```

## The critical page-reset rule

```js
useEffect(() => {
  setPage(1); // whenever the search query ITSELF changes, reset pagination
}, [debouncedQuery]);
```
Without this (see `MovieSearchBuggy.jsx`), searching something new while
sitting on page 2 of a PREVIOUS, larger result set requests "page 2" of a
result set that might only have 1 page — producing a genuinely broken,
nonsensical `"Page 2 of 1"` state. Proven directly in the Buggy test.

## The fourth state: empty vs. error

```js
if (result.totalResults === 0) {
  setStatus('empty'); // a SUCCESSFUL response, genuinely zero matches - NOT an error
} else {
  setData(result);
  setStatus('success');
}
```
An empty result set is a completely different situation from a failed
request, and deserves different messaging — collapsing both into one
`error` state would tell users "something went wrong" when actually
nothing did; their search just had no matches.

## A genuine fake-timer subtlety, diagnosed live

A single `advanceTimersByTimeAsync(600)` call failed to resolve a
debounce-then-mock-delay CHAIN (300ms + 200ms sequential, not simultaneous),
while the SAME total time split into four smaller sequential calls worked
reliably. Diagnosed via a step-by-step instrumented test logging
`document.body.textContent` at each checkpoint — not guessed at.
