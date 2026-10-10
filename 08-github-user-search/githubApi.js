class HttpError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

export async function fetchGitHubUser(username) {
  const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);
  if (!response.ok) {
    throw new HttpError(`${response.status} ${response.statusText}`, response.status);
  }
  return response.json();
}

export { HttpError };
