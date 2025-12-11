import { tmdbService } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { Film, TrendingUp, Star } from 'lucide-react';

export default async function Home() {
    const [trending, popular, topRated] = await Promise.all([
        tmdbService.getTrendingMovies('week'),
        tmdbService.getPopularMovies(),
        tmdbService.getTopRatedMovies(),
    ]);

    return (
        <div className="container mx-auto px-4 py-8 space-y-12">
            {/* Hero Section */}
            <section className="text-center space-y-6 py-12">
                <div className="inline-block p-4 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-white/10 mb-4">
                    <Film className="w-16 h-16 text-primary-400" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold">
                    <span className="gradient-text">Discover Movies</span>
                    <br />
                    <span className="text-white">Rate & Review Onchain</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Explore thousands of movies, share your honest reviews, and rate films with
                    blockchain-powered transparency on Celo.
                </p>
            </section>

            {/* Trending Movies */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-primary-400" />
                    <h2 className="text-3xl font-bold text-white">Trending This Week</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {trending.slice(0, 10).map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </section>

            {/* Popular Movies */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <Film className="w-6 h-6 text-accent-400" />
                    <h2 className="text-3xl font-bold text-white">Popular Now</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {popular.slice(0, 10).map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </section>

            {/* Top Rated */}
            <section className="space-y-6">
                <div className="flex items-center gap-3">
                    <Star className="w-6 h-6 text-yellow-400" />
                    <h2 className="text-3xl font-bold text-white">Top Rated</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {topRated.slice(0, 10).map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </section>
        </div>
    );
}
