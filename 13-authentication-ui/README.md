# Project 13 — Authentication UI

**Difficulty:** Advanced
**Concepts:** `useContext` (first real use case), mandatory security education.

## ⚠️ READ BEFORE USING ANY OF THIS CODE ELSEWHERE

**This is an educational, mock authentication system. It is explicitly,
deliberately NOT secure and must never be used in a real application.**

| | This mock | Real | Production |
|---|---|---|---|
| Credential check | Hardcoded array, checked client-side | Server-side, hashed passwords (bcrypt/argon2) | Same + rate limiting, MFA |
| "Logged in" state | `localStorage` (readable by ANY script on the page, incl. injected/malicious ones) | Server-issued token, ideally `httpOnly` cookie (invisible to JS) | Same + rotation, short lifetimes, CSRF protection |
| Token | A meaningless fake string | Cryptographically signed, verified server-side | Same + revocation lists |

**The single most important sentence:** hiding a value in frontend code never
makes it secret — anyone can read every line of downloaded JavaScript via
DevTools. Real authentication decisions must be verified server-side; the
frontend's job is to present UI and hold whatever token the server issues,
never to decide validity itself.

## Folder structure
```
13-authentication-ui/
├── AuthContext.jsx      createContext + AuthProvider + useAuth hook
├── AuthComponents.jsx   LoginForm, ProtectedContent, AuthApp
├── Auth.test.jsx        6 tests: login, wrong password, logout, session restore
└── mockAuthApi.js       Heavily-commented mock - see file for full disclosure
```

## `useContext`, introduced here for the first time in this course

```js
const AuthContext = createContext(null);
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```
Auth state is needed by components at very different tree depths (a login
form, a logout button nested inside protected content) — exactly the
scenario where prop-drilling through every unrelated intermediate layer
would be genuinely painful. The `if (context === null) throw` guard produces
a clear, immediate, actionable error instead of a confusing `undefined`
crash three components later.

## What this mock demonstrates SAFELY (genuine frontend responsibilities)
Controlled login forms, loading/error states during authentication,
conditionally rendering protected content, a clean logout flow.

## What must never be copied into a real app
The password comparison logic, the fake "token," and the localStorage-based
session persistence — none of these are how real authentication works.
