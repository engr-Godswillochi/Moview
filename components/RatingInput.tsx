'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingInputProps {
    onSubmit: (rating: number) => void;
    disabled?: boolean;
}

export default function RatingInput({ onSubmit, disabled = false }: RatingInputProps) {
    const [hoveredRating, setHoveredRating] = useState<number | null>(null);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);

    const handleClick = (rating: number) => {
        setSelectedRating(rating);
        onSubmit(rating);
    };

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="flex gap-1">
                {Array.from({ length: 10 }).map((_, index) => {
                    const rating = index + 1;
                    const isActive = hoveredRating ? rating <= hoveredRating : selectedRating ? rating <= selectedRating : false;

                    return (
                        <button
                            key={rating}
                            type="button"
                            disabled={disabled}
                            onMouseEnter={() => setHoveredRating(rating)}
                            onMouseLeave={() => setHoveredRating(null)}
                            onClick={() => handleClick(rating)}
                            className="group relative transition-transform hover:scale-125 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Star
                                className={`w-8 h-8 transition-all ${isActive
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-600'
                                    }`}
                            />
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                {rating}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="text-sm text-gray-400 h-6">
                {hoveredRating && (
                    <span>Rate: {hoveredRating}/10</span>
                )}
                {!hoveredRating && selectedRating && (
                    <span>Your rating: {selectedRating}/10</span>
                )}
                {!hoveredRating && !selectedRating && (
                    <span>Click to rate (1-10)</span>
                )}
            </div>
        </div>
    );
}
