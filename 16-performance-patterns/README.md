# Performance Patterns -- React.memo, useCallback, React.lazy/Suspense

These fill a real gap: the original course spec required `useCallback`,
`React.memo`, and code-splitting, but the 15 numbered projects never
happened to need them until this dedicated addition.

## Files
```
16-performance-patterns/
|-- PerformanceDemo.jsx        3-case proof: plain / memo-alone / memo+useCallback
|-- PerformanceDemo.test.jsx   5 tests, all with MEASURED render counts
|-- LazyLoadDemo.jsx           React.lazy + Suspense code splitting
|-- LazyLoadDemo.test.jsx      2 tests
`-- lazy-demo/HeavyPanel.jsx   The dynamically-imported "heavy" component
```

## The measured proof (see PerformanceDemo.test.jsx for exact numbers)

- **No memo:** 1 -> 4 renders across 3 unrelated parent updates.
- **memo WITHOUT useCallback:** ALSO 1 -> 4 -- memo alone did nothing, because
  the callback prop was a new function reference every render.
- **memo WITH useCallback:** stayed at 1 -- the fix actually works.

Run `npx vitest run` from a project with these files in `src/` to see all
counts for yourself.
