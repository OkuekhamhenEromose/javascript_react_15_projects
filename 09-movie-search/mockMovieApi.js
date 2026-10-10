// MOCK API - clearly labeled. Simulates a paginated movie search endpoint.

const ALL_MOVIES = [
  { id: 1, title: 'The Matrix', year: 1999 },
  { id: 2, title: 'The Matrix Reloaded', year: 2003 },
  { id: 3, title: 'The Matrix Revolutions', year: 2003 },
  { id: 4, title: 'Inception', year: 2010 },
  { id: 5, title: 'Interstellar', year: 2014 },
  { id: 6, title: 'The Dark Knight', year: 2008 },
  { id: 7, title: 'The Dark Knight Rises', year: 2012 },
  { id: 8, title: 'Memento', year: 2000 },
  { id: 9, title: 'Dunkirk', year: 2017 },
  { id: 10, title: 'Tenet', year: 2020 },
  { id: 11, title: 'Oppenheimer', year: 2023 },
];

const PAGE_SIZE = 3;

export function fetchMovies(query, page = 1, delayMs = 200) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const matches = ALL_MOVIES.filter((m) => m.title.toLowerCase().includes(query.toLowerCase()));
      const totalPages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
      const start = (page - 1) * PAGE_SIZE;
      const results = matches.slice(start, start + PAGE_SIZE);
      resolve({ results, page, totalPages, totalResults: matches.length });
    }, delayMs);
  });
}
