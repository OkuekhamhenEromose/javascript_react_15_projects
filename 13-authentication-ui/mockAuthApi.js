// ============================================================================
// MOCK AUTHENTICATION API - EDUCATIONAL ONLY. NOT SECURE. NOT PRODUCTION CODE.
// ============================================================================
// In a REAL application, none of this logic would exist in frontend code.
// Credential verification happens on a SERVER, which:
//   - never stores plaintext passwords (uses bcrypt/argon2 hashing)
//   - never sends the password verification RESULT in a way the client can forge
//   - issues a signed token (or sets an httpOnly session cookie) the client
//     cannot read, forge, or tamper with via JavaScript
//
// This mock exists ONLY to let us build and test the UI layer - the forms,
// loading/error states, and protected-content patterns - which ARE genuinely
// frontend responsibilities, distinct from the security-critical parts above.

const FAKE_USER_DATABASE = [
  { username: 'amara', password: 'correcthorse123', name: 'Amara Okafor' },
];

export function mockLogin(username, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = FAKE_USER_DATABASE.find(
        (u) => u.username === username && u.password === password
      );
      if (user) {
        // A REAL token is cryptographically signed by a server and verified
        // server-side on every subsequent request. This is just a fake string.
        resolve({ token: `fake-token-for-${user.username}`, name: user.name });
      } else {
        reject(new Error('Invalid username or password'));
      }
    }, 400);
  });
}
