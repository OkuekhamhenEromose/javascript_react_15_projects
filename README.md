# Frontend Engineering Masterclass — Project Source Code

This package contains the real, working, fully-tested source code for React
Foundations and all 15 course projects. Every file here was actually written,
run, and tested during the course (Vite + React 19 + Vitest + React Testing
Library) — nothing in these folders is illustrative pseudocode.

## Folder structure

```
delivered-projects/
├── 00-react-foundations/     Components/JSX, useState, lists+keys,
│                             controlled inputs, lifting state up
├── 01-counter-dashboard/     Project 1
├── 02-todo-app/              Project 2
├── 03-expense-tracker/       Project 3
├── 04-notes-app/             Project 4
├── 05-product-catalog/       Project 5
├── 06-quiz-app/              Project 6
├── 07-weather-dashboard/     Project 7
├── 08-github-user-search/    Project 8
├── 09-movie-search/          Project 9
├── 10-shopping-cart/         Project 10
├── 11-habit-tracker/         Project 11
├── 12-kanban-board/          Project 12
├── 13-authentication-ui/     Project 13
├── 14-admin-dashboard/       Project 14
└── 15-fullstack-capstone/    Project 15
```

Each project folder is **self-contained** — where a project reuses a shared
hook or data file (e.g. `useLocalStorageState.js`, `useDebouncedValue.js`,
`productData.js`, `AuthContext.jsx`), that file is copied directly into every
folder that needs it, rather than referenced from elsewhere. This means you
can take any single numbered folder on its own and it has everything it needs.

Each folder contains its own `README.md` with: concepts exercised, the data/
state model, a code walkthrough, the real bug that was found and fixed during
development (with root cause and fix explained), and a short senior-engineer
review. Source files themselves are commented at the points that most need
explaining — read the README first, then the code, since the README points
out *why*, and the code shows *how*.

## Running any project for real

These files were built inside one shared Vite project. To run any folder's
code and tests yourself:

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
# Project 15 additionally needs: npm install react-router-dom
```

Add this to `vite.config.js`:
```js
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.js',
  },
})
```

Create `src/test-setup.js`:
```js
import '@testing-library/jest-dom';
```

Then copy any project folder's `.jsx`/`.js` files into `src/`, and run:
```bash
npx vitest run
```

Files ending in `Buggy.jsx` are **intentional bugs** — the accompanying
`.test.jsx` files that reference them are designed to demonstrate a specific
failure (some fail on purpose, marked `test.fails(...)`, to prove the bug
exists; others assert the buggy behavior directly to document it without
red-lining the suite). Each project's README explains exactly which is which.
