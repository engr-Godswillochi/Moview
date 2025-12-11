import { tmdbService } from '@/services/tmdb';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import MovieReviews from '@/components/MovieReviews';
import { Calendar, Clock } from 'lucide-react';

interface MoviePageProps {
    params: { id: string };
}

export default async function MoviePage({ params }: MoviePageProps) {
    const movieId = parseInt(params.id);

    if (isNaN(movieId)) {
        notFound();
    }

    const [movie, credits] = await Promise.all([
        tmdbService.getMovieDetails(movieId),
        tmdbService.getMovieCredits(movieId),
    ]);

    if (!movie) {
        notFound();
    }

    const backdropUrl = tmdbService.getBackdropUrl(movie.backdrop_path, 'original');
    const posterUrl = tmdbService.getPosterUrl(movie.poster_path, 'w500');
    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';

    return (
        <div className="min-h-screen">
            {/* Hero Section with Backdrop */}
            <div className="relative h-[60vh] md:h-[70vh]">
                {/* Backdrop Image */}
                <div className="absolute inset-0">
                    <Image
                        src={backdropUrl}
                        alt={movie.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/40" />
                </div>

                {/* Movie Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="container mx-auto">
                        <div className="flex flex-col md:flex-row gap-8 items-end">
                            {/* Poster */}
                            <div className="relative w-48 h-72 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl hidden md:block">
                                <Image
                                    src={posterUrl}
                                    alt={movie.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Title and Meta */}
                            <div className="flex-1 space-y-4">
                                <h1 className="text-4xl md:text-6xl font-bold text-white">
                                    {movie.title}
                                </h1>

                                {movie.tagline && (
                                    <p className="text-xl text-gray-300 italic">&quot;{movie.tagline}&quot;</p>
                                )}

                                <div className="flex flex-wrap items-center gap-4 text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5" />
                                        <span>{year}</span>
                                    </div>

                                    {movie.runtime && (
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-5 h-5" />
                                            <span>{movie.runtime} min</span>
                                        </div>
                                    )}

                                    {movie.genres && movie.genres.length > 0 && (
                                        <div className="flex gap-2">
                                            {movie.genres.slice(0, 3).map((genre) => (
                                                <span
                                                    key={genre.id}
                                                    className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20"
                                                >
                                                    {genre.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12 space-y-12">
                {/* Overview */}
                <section className="space-y-4">
                    <h2 className="text-3xl font-bold text-white">Overview</h2>
                    <p className="text-lg text-gray-300 leading-relaxed max-w-4xl">
                        {movie.overview || 'No overview available.'}
                    </p>
                </section>

                {/* Cast */}
                {credits && credits.cast.length > 0 && (
                    <section className="space-y-6">
                        <h2 className="text-3xl font-bold text-white">Cast</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {credits.cast.slice(0, 6).map((actor) => (
                                <div key={actor.id} className="glass rounded-lg p-4 space-y-2">
                                    {actor.profile_path ? (
                                        <div className="relative aspect-square rounded-lg overflow-hidden">
                                            <Image
                                                src={tmdbService.getPosterUrl(actor.profile_path, 'w185')}
                                                alt={actor.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="aspect-square rounded-lg bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                                            <span className="text-4xl text-gray-600">
                                                {actor.name.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold text-white text-sm">{actor.name}</p>
                                        <p className="text-xs text-gray-400 line-clamp-1">{actor.character}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Reviews and Ratings */}
                <MovieReviews movieId={movieId} />
            </div>
        </div>
    );
}
