'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/config/contract';
import RatingInput from './RatingInput';
import { Loader2 } from 'lucide-react';

interface ReviewFormProps {
    movieId: number;
    onSuccess?: () => void;
}

export default function ReviewForm({ movieId, onSuccess }: ReviewFormProps) {
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { writeContract, data: hash, error, isPending } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!rating || !reviewText.trim()) {
            alert('Please provide both a rating and review text');
            return;
        }

        if (reviewText.length > 1000) {
            alert('Review text must be 1000 characters or less');
            return;
        }

        try {
            setIsSubmitting(true);

            writeContract({
                address: CONTRACT_ADDRESS,
                abi: CONTRACT_ABI,
                functionName: 'addReview',
                args: [BigInt(movieId), reviewText, rating],
            });
        } catch (err) {
            console.error('Error submitting review:', err);
            setIsSubmitting(false);
        }
    };

    // Reset form on success
    if (isSuccess && isSubmitting) {
        setReviewText('');
        setRating(null);
        setIsSubmitting(false);
        if (onSuccess) onSuccess();
    }

    return (
        <form onSubmit={handleSubmit} className="glass rounded-xl p-6 space-y-6">
            <h3 className="text-2xl font-bold text-white">Write a Review</h3>

            {/* Rating Input */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                    Your Rating
                </label>
                <RatingInput
                    onSubmit={setRating}
                    disabled={isPending || isConfirming}
                />
            </div>

            {/* Review Text */}
            <div className="space-y-2">
                <label htmlFor="review-text" className="block text-sm font-medium text-gray-300">
                    Your Review
                </label>
                <textarea
                    id="review-text"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your thoughts about this movie..."
                    rows={6}
                    maxLength={1000}
                    disabled={isPending || isConfirming}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none disabled:opacity-50"
                />
                <div className="flex justify-between text-sm text-gray-400">
                    <span>{reviewText.length}/1000 characters</span>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-sm text-red-400">
                        Error: {error.message}
                    </p>
                </div>
            )}

            {/* Success Message */}
            {isSuccess && !isSubmitting && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-sm text-green-400">
                        Review submitted successfully! It may take a moment to appear.
                    </p>
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={!rating || !reviewText.trim() || isPending || isConfirming}
                className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-accent-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {(isPending || isConfirming) && (
                    <Loader2 className="w-5 h-5 animate-spin" />
                )}
                {isPending && 'Confirm in wallet...'}
                {isConfirming && 'Submitting review...'}
                {!isPending && !isConfirming && 'Submit Review'}
            </button>
        </form>
    );
}
