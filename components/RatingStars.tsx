'use client';

import { Star } from 'lucide-react';

interface RatingStarsProps {
    rating: number; // 0-10
    maxRating?: number;
    size?: 'sm' | 'md' | 'lg';
    interactive?: boolean;
    onRate?: (rating: number) => void;
}

export default function RatingStars({
    rating,
    maxRating = 10,
    size = 'md',
    interactive = false,
    onRate,
}: RatingStarsProps) {
    const stars = 5; // Display as 5 stars
    const normalizedRating = (rating / maxRating) * stars;

    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    const handleClick = (index: number) => {
        if (interactive && onRate) {
            // Convert 5-star rating back to 10-point scale
            const newRating = Math.round(((index + 1) / stars) * maxRating);
            onRate(newRating);
        }
    };

    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: stars }).map((_, index) => {
                const fillPercentage = Math.min(Math.max(normalizedRating - index, 0), 1);
                const isFilled = fillPercentage > 0;
                const isHalf = fillPercentage > 0 && fillPercentage < 1;

                return (
                    <div
                        key={index}
                        className={`relative ${interactive ? 'cursor-pointer' : ''}`}
                        onClick={() => handleClick(index)}
                    >
                        {/* Background star */}
                        <Star
                            className={`${sizeClasses[size]} text-gray-600 transition-all ${interactive ? 'hover:scale-110' : ''
                                }`}
                        />

                        {/* Filled star overlay */}
                        {isFilled && (
                            <div
                                className="absolute inset-0 overflow-hidden"
                                style={{ width: `${fillPercentage * 100}%` }}
                            >
                                <Star
                                    className={`${sizeClasses[size]} text-yellow-400 fill-yellow-400 transition-all ${interactive ? 'hover:scale-110' : ''
                                        }`}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
            <span className="ml-2 text-sm text-gray-400">
                {rating.toFixed(1)}/{maxRating}
            </span>
        </div>
    );
}
