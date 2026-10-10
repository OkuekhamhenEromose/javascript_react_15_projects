function MovieCard({ movie }) {
  return (
    <li>
      {movie.title} ({movie.year})
    </li>
  );
}

export default MovieCard;
