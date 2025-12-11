'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/services/tmdb';
import { tmdbService } from '@/services/tmdb';
import { Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/config/contract';

interface MovieCardProps {
    movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
    const [onchainRating, setOnchainRating] = useState<number | null>(null);
    const [ratingCount, setRatingCount] = useState<number>(0);

    // Fetch onchain rating
    const { data: ratingData } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getAverageRating',
        args: [BigInt(movie.id)],
    });

    useEffect(() => {
        if (ratingData) {
            const [average, count] = ratingData as [bigint, bigint];
            setOnchainRating(Number(average) / 100); // Convert from scaled value
            setRatingCount(Number(count));
        }
    }, [ratingData]);

    const posterUrl = tmdbService.getPosterUrl(movie.poster_path, 'w342');
    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';

    return (
        <Link href={`/movie/${movie.id}`}>
            <div className="group relative glass glass-hover rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 animate-fade-in">
                {/* Poster Image */}
                <div className="relative aspect-[2/3] overflow-hidden">
                    <Image
                        src={posterUrl}
                        alt={movie.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Rating Badge */}
                    {onchainRating !== null && ratingCount > 0 && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-lg">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-semibold text-white">
                                {onchainRating.toFixed(1)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Movie Info */}
                <div className="p-4">
                    <h3 className="font-semibold text-white line-clamp-1 group-hover:text-primary-400 transition-colors">
                        {movie.title}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-400">{year}</span>
                        {ratingCount > 0 && (
                            <span className="text-xs text-gray-500">
                                {ratingCount} {ratingCount === 1 ? 'review' : 'reviews'}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
