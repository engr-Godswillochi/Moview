import { tmdbService } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { notFound } from 'next/navigation';

interface SearchPageProps {
    searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const query = searchParams.q;

    if (!query) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold text-white mb-4">Search Movies</h1>
                <p className="text-gray-400">Enter a search query to find movies</p>
            </div>
        );
    }

    const { results: movies } = await tmdbService.searchMovies(query);

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold text-white">
                    Search Results for &quot;{query}&quot;
                </h1>
                <p className="text-gray-400">
                    Found {movies.length} {movies.length === 1 ? 'movie' : 'movies'}
                </p>
            </div>

            {movies.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-xl text-gray-400">
                        No movies found. Try a different search term.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    );
}
