import { useState, useEffect } from 'react';
import { useDebouncedValue } from './useDebouncedValue';
import { fetchGitHubUser as realFetchGitHubUser } from './githubApi';

function GitHubUserSearch({ fetchUser = realFetchGitHubUser }) {
  const [rawQuery, setRawQuery] = useState('');
  const debouncedQuery = useDebouncedValue(rawQuery, 400);
  const [status, setStatus] = useState('idle'); // idle | loading | error | success
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (debouncedQuery.trim() === '') {
      setStatus('idle');
      return;
    }

    let ignore = false;
    setStatus('loading');

    fetchUser(debouncedQuery)
      .then((data) => {
        if (ignore) return;
        setUser(data);
        setStatus('success');
      })
      .catch((error) => {
        if (ignore) return;
        setErrorMessage(error.message);
        setStatus('error');
      });

    return () => {
      ignore = true;
    };
  }, [debouncedQuery, fetchUser]);

  return (
    <div>
      <label htmlFor="github-search">GitHub username</label>
      <input id="github-search" value={rawQuery} onChange={(e) => setRawQuery(e.target.value)} />

      {status === 'idle' && <p>Type a username to search.</p>}
      {status === 'loading' && <p>Loading...</p>}
      {status === 'error' && <p role="alert">Could not find user: {errorMessage}</p>}
      {status === 'success' && user && (
        <div data-testid="user-result">
          <h2>{user.login}</h2>
          <p>{user.public_repos} public repos</p>
          <p>{user.followers} followers</p>
        </div>
      )}
    </div>
  );
}

export default GitHubUserSearch;
