'use client';

import { Review } from '@/config/contract';
import { Heart } from 'lucide-react';
import { useState } from 'react';

interface ReviewCardProps {
    review: Review;
    reviewId: number;
    onLike?: (reviewId: number) => void;
    onUnlike?: (reviewId: number) => void;
    hasLiked?: boolean;
    isOwnReview?: boolean;
}

export default function ReviewCard({
    review,
    reviewId,
    onLike,
    onUnlike,
    hasLiked = false,
    isOwnReview = false,
}: ReviewCardProps) {
    const [isLiking, setIsLiking] = useState(false);

    const handleLikeClick = async () => {
        if (isOwnReview || isLiking) return;

        setIsLiking(true);
        try {
            if (hasLiked && onUnlike) {
                await onUnlike(reviewId);
            } else if (!hasLiked && onLike) {
                await onLike(reviewId);
            }
        } finally {
            setIsLiking(false);
        }
    };

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const formatDate = (timestamp: bigint) => {
        const date = new Date(Number(timestamp) * 1000);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="glass rounded-xl p-6 space-y-4 animate-slide-up">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold">
                        {review.user.slice(2, 4).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-medium text-white">{formatAddress(review.user)}</p>
                        <p className="text-sm text-gray-400">{formatDate(review.timestamp)}</p>
                    </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 px-3 py-1 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
                    <span className="text-yellow-400 font-semibold">{review.rating}</span>
                    <span className="text-yellow-400/60 text-sm">/10</span>
                </div>
            </div>

            {/* Review Text */}
            <p className="text-gray-300 leading-relaxed">{review.text}</p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                    onClick={handleLikeClick}
                    disabled={isOwnReview || isLiking}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${hasLiked
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    <Heart
                        className={`w-4 h-4 ${hasLiked ? 'fill-red-400' : ''}`}
                    />
                    <span className="text-sm font-medium">
                        {Number(review.likes)} {Number(review.likes) === 1 ? 'Like' : 'Likes'}
                    </span>
                </button>

                {isOwnReview && (
                    <span className="text-xs text-gray-500 italic">Your review</span>
                )}
            </div>
        </div>
    );
}
