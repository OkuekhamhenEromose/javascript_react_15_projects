# Project 7 — Weather Dashboard

**Difficulty:** Intermediate
**Concepts:** the single most important async-React lesson in this course — RACE CONDITIONS.

**Mock API disclosure:** no real weather API is reachable from a sandboxed
environment's typical network allowlist. `mockWeatherApi.js` is clearly
labeled as a mock with realistic, configurable delay.

## Folder structure
```
07-weather-dashboard/
├── WeatherDashboard.jsx         FIXED version - race-condition-safe
├── WeatherDashboard.test.jsx    3 tests, incl. the exact race scenario, now safe
├── WeatherDashboardBuggy.jsx    BROKEN version - no protection
├── WeatherDashboardBuggy.test.jsx  PROVES the race condition happens
└── mockWeatherApi.js            Mock API, clearly labeled, configurable delay
```

## The race condition, proven

Search a SLOW city (1000ms mock delay), then immediately a FAST city (100ms).
The fast city's response correctly arrives and displays first — then the slow
city's now-STALE response arrives late and **silently overwrites it**. Run
`WeatherDashboardBuggy.test.jsx` to watch this actually happen.

## The fix

```js
useEffect(() => {
  if (!city) return;
  let ignore = false; // fresh, closure-scoped flag for THIS specific effect run
  setStatus('loading');
  fetchWeather(city, delayMs)
    .then((data) => {
      if (ignore) return; // this response belongs to a SUPERSEDED request
      setWeather(data);
      setStatus('success');
    })
    .catch(() => { if (!ignore) setStatus('error'); });
  return () => { ignore = true; }; // React calls this BEFORE the next effect run
}, [city, delayMs]);
```
Each effect run gets its OWN independent `ignore` closure (Snippet 17's exact
closure mechanism). When a newer request starts, React's cleanup marks the
OLD request's flag `true` — so even if the old response arrives late, it's
discarded rather than applied.

## Extension challenge
Rebuild using a real `AbortController` (`controller.abort()` in cleanup)
instead of the `ignore` flag — the preferred approach for genuine `fetch`
calls, since it actually cancels the network request rather than just
ignoring its eventual result. The `ignore`-flag pattern here is correct
specifically because a `setTimeout`-based mock can't be cancelled at all.
