# Project 5 — Searchable Product Catalog

**Difficulty:** Intermediate
**Concepts:** a full derived pipeline (search -> filter -> sort), `useMemo` with MEASURED proof.

## Folder structure
```
05-product-catalog/
├── ProductCatalog.jsx    Search + category filter + sort, memoized pipeline
├── ProductCatalog.test.jsx  6 tests, incl. a PROOF test for useMemo
├── productData.js        Static product data + category list
└── useDebouncedValue.js  Reused from Project 4
```

## The proof, not just the claim

`ProductCatalog.jsx` includes test-only instrumentation:
```js
let filterComputeCount = 0;
export function getFilterComputeCount() { return filterComputeCount; }
```
incremented inside the `useMemo` callback. The test file then:
1. Renders once -> asserts count is `1`.
2. Clicks a button that changes ONLY `unrelatedCounter` (deliberately NOT in
   the `useMemo` dependency array) three times -> asserts count is STILL `1`.
3. Changes the actual `category` filter -> asserts count is now `2`.

This is the only reliable way to know memoization is doing anything — the
*visible output* looks identical whether or not `useMemo` is working; only
instrumentation reveals whether the expensive block actually re-ran.

```js
const visibleProducts = useMemo(() => {
  filterComputeCount++;
  // ...search filter, category filter, sort...
}, [debouncedQuery, category, sortBy]); // unrelatedCounter deliberately excluded
```

## Senior review notes
- **When to reach for `useMemo`:** only when you can point to a concrete,
  measured reason — an identifiably expensive computation whose inputs don't
  change every render. It's an optimization, never a correctness requirement;
  the same result is produced either way, just recalculated more or less often.
- **Common mistake to avoid:** getting the dependency array wrong (e.g.
  omitting `category`) silently shows STALE results when that filter changes
  — a real, hard-to-spot bug class.
