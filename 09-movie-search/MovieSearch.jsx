import { useState, useEffect } from 'react';
import { useDebouncedValue } from './useDebouncedValue';
import { fetchMovies } from './mockMovieApi';
import MovieCard from './MovieCard';

function MovieSearch() {
  const [rawQuery, setRawQuery] = useState('');
  const debouncedQuery = useDebouncedValue(rawQuery, 300);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('idle'); // idle | loading | error | empty | success
  const [data, setData] = useState(null);

  // CRITICAL: reset to page 1 whenever the search query itself changes.
  // Without this, searching something new while sitting on page 3 would
  // request page 3 of a completely different, possibly much smaller result set.
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  useEffect(() => {
    if (debouncedQuery.trim() === '') {
      setStatus('idle');
      return;
    }

    let ignore = false;
    setStatus('loading');

    fetchMovies(debouncedQuery, page)
      .then((result) => {
        if (ignore) return;
        if (result.totalResults === 0) {
          setStatus('empty'); // successful response, genuinely zero matches - NOT an error
        } else {
          setData(result);
          setStatus('success');
        }
      })
      .catch(() => {
        if (ignore) return;
        setStatus('error');
      });

    return () => { ignore = true; };
  }, [debouncedQuery, page]);

  return (
    <div>
      <label htmlFor="movie-search">Search movies</label>
      <input id="movie-search" value={rawQuery} onChange={(e) => setRawQuery(e.target.value)} />

      {status === 'idle' && <p>Search for a movie.</p>}
      {status === 'loading' && <p>Loading...</p>}
      {status === 'error' && <p role="alert">Something went wrong. Please try again.</p>}
      {status === 'empty' && <p>No movies found for "{debouncedQuery}".</p>}
      {status === 'success' && data && (
        <>
          <ul>
            {data.results.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
          </ul>
          <div>
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
            <span data-testid="page-indicator"> Page {data.page} of {data.totalPages} </span>
            <button disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}

export default MovieSearch;
