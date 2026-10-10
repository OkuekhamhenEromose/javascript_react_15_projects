# Project 14 — Mini Admin Dashboard

**Difficulty:** Intermediate-Advanced
**Concepts:** sortable/searchable/paginated table + a derived chart with NO charting library.

## Folder structure
```
14-admin-dashboard/
├── AdminDashboard.jsx      Table + RoleBarChart, all derived/memoized
├── AdminDashboard.test.jsx 6 tests
└── adminData.js            Static user records
```

## The chart, built with plain CSS - no dependency

```js
const counts = useMemo(() => {
  return users.reduce((acc, u) => { acc[u.role] = (acc[u.role] ?? 0) + 1; return acc; }, {});
}, [users]);
const maxCount = Math.max(...Object.values(counts), 1);
// ... each bar: width: `${(count / maxCount) * 100}%`
```
Directly following this course's dependency policy: prefer native
capabilities when they're sufficient. A simple proportional bar comparison
doesn't justify pulling in a charting library.

## Sort + search BOTH reset pagination proactively

```js
function handleSort(key) {
  // ...
  setPage(1); // reset pagination on any sort change
}
function handleSearchChange(value) {
  setSearchQuery(value);
  setPage(1); // reset pagination when the filter itself changes
}
```
This is Project 9's page-reset lesson applied PROACTIVELY here, rather than
discovered reactively after a bug — the exact bug class ("Page 2 of 1")
from Project 9 is prevented by design from the start.

## Senior review note
`filteredAndSorted` recalculates a full sort on every keystroke for this
small, static dataset — irrelevant here, but debouncing (reusing
`useDebouncedValue` from Project 4) would be the right addition the moment
this dashboard's data source became a real, larger, server-backed set.
