import axios from 'axios';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    vote_average: number;
    vote_count: number;
    genre_ids?: number[];
    genres?: Genre[];
    runtime?: number;
    tagline?: string;
}

export interface Genre {
    id: number;
    name: string;
}

export interface Cast {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

export interface Credits {
    cast: Cast[];
}

class TMDBService {
    private apiKey: string;

    constructor() {
        this.apiKey = TMDB_API_KEY || '';
    }

    /**
     * Get poster image URL
     */
    getPosterUrl(path: string | null, size: 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
        if (!path) return '/placeholder-movie.png';
        return `${IMAGE_BASE_URL}/${size}${path}`;
    }

    /**
     * Get backdrop image URL
     */
    getBackdropUrl(path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string {
        if (!path) return '/placeholder-backdrop.png';
        return `${IMAGE_BASE_URL}/${size}${path}`;
    }

    /**
     * Search for movies
     */
    async searchMovies(query: string, page: number = 1): Promise<{ results: Movie[]; total_pages: number }> {
        try {
            const response = await axios.get(`${BASE_URL}/search/movie`, {
                params: {
                    api_key: this.apiKey,
                    query,
                    page,
                    include_adult: false,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error searching movies:', error);
            return { results: [], total_pages: 0 };
        }
    }

    /**
     * Get movie details by ID
     */
    async getMovieDetails(movieId: number): Promise<Movie | null> {
        try {
            const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
                params: {
                    api_key: this.apiKey,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching movie details:', error);
            return null;
        }
    }

    /**
     * Get trending movies
     */
    async getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<Movie[]> {
        try {
            const response = await axios.get(`${BASE_URL}/trending/movie/${timeWindow}`, {
                params: {
                    api_key: this.apiKey,
                },
            });
            return response.data.results;
        } catch (error) {
            console.error('Error fetching trending movies:', error);
            return [];
        }
    }

    /**
     * Get popular movies
     */
    async getPopularMovies(page: number = 1): Promise<Movie[]> {
        try {
            const response = await axios.get(`${BASE_URL}/movie/popular`, {
                params: {
                    api_key: this.apiKey,
                    page,
                },
            });
            return response.data.results;
        } catch (error) {
            console.error('Error fetching popular movies:', error);
            return [];
        }
    }

    /**
     * Get top rated movies
     */
    async getTopRatedMovies(page: number = 1): Promise<Movie[]> {
        try {
            const response = await axios.get(`${BASE_URL}/movie/top_rated`, {
                params: {
                    api_key: this.apiKey,
                    page,
                },
            });
            return response.data.results;
        } catch (error) {
            console.error('Error fetching top rated movies:', error);
            return [];
        }
    }

    /**
     * Get movie credits (cast and crew)
     */
    async getMovieCredits(movieId: number): Promise<Credits | null> {
        try {
            const response = await axios.get(`${BASE_URL}/movie/${movieId}/credits`, {
                params: {
                    api_key: this.apiKey,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching movie credits:', error);
            return null;
        }
    }

    /**
     * Get similar movies
     */
    async getSimilarMovies(movieId: number): Promise<Movie[]> {
        try {
            const response = await axios.get(`${BASE_URL}/movie/${movieId}/similar`, {
                params: {
                    api_key: this.apiKey,
                },
            });
            return response.data.results;
        } catch (error) {
            console.error('Error fetching similar movies:', error);
            return [];
        }
    }
}

export const tmdbService = new TMDBService();
