'use client';

import { useEffect, useState } from 'react';
import { useReadContract, useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI, Review } from '@/config/contract';
import ReviewCard from '@/components/ReviewCard';
import ReviewForm from '@/components/ReviewForm';
import RatingStars from '@/components/RatingStars';
import RatingInput from '@/components/RatingInput';
import { Loader2, MessageSquare } from 'lucide-react';

interface MovieReviewsProps {
    movieId: number;
}

export default function MovieReviews({ movieId }: MovieReviewsProps) {
    const { address } = useAccount();
    const [reviews, setReviews] = useState<(Review & { id: number })[]>([]);
    const [averageRating, setAverageRating] = useState<number>(0);
    const [ratingCount, setRatingCount] = useState<number>(0);
    const [hasReviewed, setHasReviewed] = useState(false);
    const [hasRated, setHasRated] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    // Fetch review IDs
    const { data: reviewIds, refetch: refetchReviewIds } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getMovieReviewIds',
        args: [BigInt(movieId)],
    });

    // Fetch reviews
    const { data: reviewsData, refetch: refetchReviews } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getReviews',
        args: reviewIds && (reviewIds as bigint[]).length > 0 ? [reviewIds as bigint[]] : undefined,
        query: {
            enabled: !!reviewIds && (reviewIds as bigint[]).length > 0,
        },
    });

    // Fetch average rating
    const { data: ratingData, refetch: refetchRating } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getAverageRating',
        args: [BigInt(movieId)],
    });

    // Check if user has reviewed
    const { data: userReviewed } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'userHasReviewed',
        args: address ? [BigInt(movieId), address] : undefined,
        query: {
            enabled: !!address,
        },
    });

    // Check if user has rated
    const { data: userRated } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'userHasRated',
        args: address ? [BigInt(movieId), address] : undefined,
        query: {
            enabled: !!address,
        },
    });

    // Rating submission
    const { writeContract: submitRating, data: ratingHash, isPending: isRatingPending } = useWriteContract();
    const { isLoading: isRatingConfirming, isSuccess: isRatingSuccess } = useWaitForTransactionReceipt({
        hash: ratingHash,
    });

    // Like review
    const { writeContract: likeReview, isPending: isLikePending } = useWriteContract();

    useEffect(() => {
        if (reviewsData && reviewIds) {
            const formattedReviews = (reviewsData as Review[]).map((review, index) => ({
                ...review,
                id: Number((reviewIds as bigint[])[index]),
            }));
            setReviews(formattedReviews);
        }
    }, [reviewsData, reviewIds]);

    useEffect(() => {
        if (ratingData) {
            const [average, count] = ratingData as [bigint, bigint];
            setAverageRating(Number(average) / 100);
            setRatingCount(Number(count));
        }
    }, [ratingData]);

    useEffect(() => {
        setHasReviewed(!!userReviewed);
    }, [userReviewed]);

    useEffect(() => {
        setHasRated(!!userRated);
    }, [userRated]);

    // Refresh data after successful rating
    useEffect(() => {
        if (isRatingSuccess) {
            setTimeout(() => {
                refetchRating();
                refetchReviewIds();
                setRefreshKey(prev => prev + 1);
            }, 2000);
        }
    }, [isRatingSuccess, refetchRating, refetchReviewIds]);

    const handleRatingSubmit = (rating: number) => {
        if (!address) {
            alert('Please connect your wallet to rate this movie');
            return;
        }

        submitRating({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'addRating',
            args: [BigInt(movieId), rating],
        });
    };

    const handleReviewSuccess = () => {
        setTimeout(() => {
            refetchReviewIds();
            refetchReviews();
            refetchRating();
            setRefreshKey(prev => prev + 1);
        }, 2000);
    };

    const handleLike = (reviewId: number) => {
        if (!address) {
            alert('Please connect your wallet to like reviews');
            return;
        }

        likeReview({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'likeReview',
            args: [BigInt(reviewId)],
        });
    };

    const handleUnlike = (reviewId: number) => {
        if (!address) return;

        likeReview({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'unlikeReview',
            args: [BigInt(reviewId)],
        });
    };

    return (
        <div className="space-y-8">
            {/* Rating Section */}
            <div className="glass rounded-xl p-8 space-y-6">
                <h2 className="text-3xl font-bold text-white">Community Rating</h2>

                {ratingCount > 0 ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="text-6xl font-bold gradient-text">
                                {averageRating.toFixed(1)}
                            </div>
                            <div className="space-y-2">
                                <RatingStars rating={averageRating} size="lg" />
                                <p className="text-sm text-gray-400">
                                    Based on {ratingCount} {ratingCount === 1 ? 'rating' : 'ratings'}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-400">No ratings yet. Be the first to rate!</p>
                )}

                {/* Rate this movie */}
                {!hasRated && address && (
                    <div className="pt-6 border-t border-white/10 space-y-4">
                        <h3 className="text-xl font-semibold text-white">Rate this movie</h3>
                        <RatingInput
                            onSubmit={handleRatingSubmit}
                            disabled={isRatingPending || isRatingConfirming}
                        />
                        {(isRatingPending || isRatingConfirming) && (
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>
                                    {isRatingPending && 'Confirm in wallet...'}
                                    {isRatingConfirming && 'Submitting rating...'}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {hasRated && (
                    <div className="pt-6 border-t border-white/10">
                        <p className="text-sm text-green-400">✓ You have rated this movie</p>
                    </div>
                )}

                {!address && (
                    <div className="pt-6 border-t border-white/10">
                        <p className="text-sm text-gray-400">Connect your wallet to rate this movie</p>
                    </div>
                )}
            </div>

            {/* Reviews Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <MessageSquare className="w-6 h-6 text-primary-400" />
                    <h2 className="text-3xl font-bold text-white">Reviews</h2>
                    <span className="text-gray-400">({reviews.length})</span>
                </div>

                {/* Review Form */}
                {!hasReviewed && address && (
                    <ReviewForm movieId={movieId} onSuccess={handleReviewSuccess} />
                )}

                {hasReviewed && address && (
                    <div className="glass rounded-xl p-6">
                        <p className="text-sm text-green-400">✓ You have already reviewed this movie</p>
                    </div>
                )}

                {!address && (
                    <div className="glass rounded-xl p-6">
                        <p className="text-sm text-gray-400">Connect your wallet to write a review</p>
                    </div>
                )}

                {/* Reviews List */}
                {reviews.length > 0 ? (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <ReviewCard
                                key={review.id}
                                review={review}
                                reviewId={review.id}
                                onLike={handleLike}
                                onUnlike={handleUnlike}
                                isOwnReview={address?.toLowerCase() === review.user.toLowerCase()}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="glass rounded-xl p-12 text-center">
                        <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No reviews yet. Be the first to review!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
