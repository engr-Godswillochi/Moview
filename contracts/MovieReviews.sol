// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MovieReviews
 * @dev Smart contract for storing movie ratings and reviews on Celo Sepolia
 */
contract MovieReviews {
    struct Review {
        address user;
        uint256 movieId;
        string text;
        uint8 rating; // 1-10
        uint256 timestamp;
        uint256 likes;
    }

    struct Rating {
        address user;
        uint256 movieId;
        uint8 rating; // 1-10
        uint256 timestamp;
    }

    // Mapping from review ID to Review
    mapping(uint256 => Review) public reviews;
    
    // Mapping from movie ID to array of review IDs
    mapping(uint256 => uint256[]) public movieReviews;
    
    // Mapping from movie ID to array of ratings
    mapping(uint256 => Rating[]) public movieRatings;
    
    // Mapping to check if user has reviewed a movie (movieId => user => hasReviewed)
    mapping(uint256 => mapping(address => bool)) public hasReviewed;
    
    // Mapping to check if user has rated a movie (movieId => user => hasRated)
    mapping(uint256 => mapping(address => bool)) public hasRated;
    
    // Mapping to track which users liked which reviews (reviewId => user => hasLiked)
    mapping(uint256 => mapping(address => bool)) public hasLikedReview;
    
    // Counter for review IDs
    uint256 public reviewCounter;

    // Events
    event RatingAdded(address indexed user, uint256 indexed movieId, uint8 rating, uint256 timestamp);
    event ReviewAdded(address indexed user, uint256 indexed movieId, uint256 reviewId, uint8 rating, uint256 timestamp);
    event ReviewLiked(address indexed user, uint256 indexed reviewId, uint256 totalLikes);
    event ReviewUnliked(address indexed user, uint256 indexed reviewId, uint256 totalLikes);

    /**
     * @dev Add a rating for a movie (1-10)
     * @param movieId The TMDB movie ID
     * @param rating The rating value (1-10)
     */
    function addRating(uint256 movieId, uint8 rating) external {
        require(rating >= 1 && rating <= 10, "Rating must be between 1 and 10");
        require(!hasRated[movieId][msg.sender], "You have already rated this movie");

        Rating memory newRating = Rating({
            user: msg.sender,
            movieId: movieId,
            rating: rating,
            timestamp: block.timestamp
        });

        movieRatings[movieId].push(newRating);
        hasRated[movieId][msg.sender] = true;

        emit RatingAdded(msg.sender, movieId, rating, block.timestamp);
    }

    /**
     * @dev Add a review with rating for a movie
     * @param movieId The TMDB movie ID
     * @param text The review text
     * @param rating The rating value (1-10)
     */
    function addReview(uint256 movieId, string memory text, uint8 rating) external {
        require(rating >= 1 && rating <= 10, "Rating must be between 1 and 10");
        require(bytes(text).length > 0, "Review text cannot be empty");
        require(bytes(text).length <= 1000, "Review text too long (max 1000 characters)");
        require(!hasReviewed[movieId][msg.sender], "You have already reviewed this movie");

        uint256 reviewId = reviewCounter++;

        Review memory newReview = Review({
            user: msg.sender,
            movieId: movieId,
            text: text,
            rating: rating,
            timestamp: block.timestamp,
            likes: 0
        });

        reviews[reviewId] = newReview;
        movieReviews[movieId].push(reviewId);
        hasReviewed[movieId][msg.sender] = true;

        // Also add the rating
        if (!hasRated[movieId][msg.sender]) {
            Rating memory newRating = Rating({
                user: msg.sender,
                movieId: movieId,
                rating: rating,
                timestamp: block.timestamp
            });
            movieRatings[movieId].push(newRating);
            hasRated[movieId][msg.sender] = true;
        }

        emit ReviewAdded(msg.sender, movieId, reviewId, rating, block.timestamp);
    }

    /**
     * @dev Like a review
     * @param reviewId The review ID to like
     */
    function likeReview(uint256 reviewId) external {
        require(reviewId < reviewCounter, "Review does not exist");
        require(!hasLikedReview[reviewId][msg.sender], "You have already liked this review");
        require(reviews[reviewId].user != msg.sender, "Cannot like your own review");

        reviews[reviewId].likes++;
        hasLikedReview[reviewId][msg.sender] = true;

        emit ReviewLiked(msg.sender, reviewId, reviews[reviewId].likes);
    }

    /**
     * @dev Unlike a review
     * @param reviewId The review ID to unlike
     */
    function unlikeReview(uint256 reviewId) external {
        require(reviewId < reviewCounter, "Review does not exist");
        require(hasLikedReview[reviewId][msg.sender], "You have not liked this review");

        reviews[reviewId].likes--;
        hasLikedReview[reviewId][msg.sender] = false;

        emit ReviewUnliked(msg.sender, reviewId, reviews[reviewId].likes);
    }

    /**
     * @dev Get average rating for a movie
     * @param movieId The TMDB movie ID
     * @return average The average rating (scaled by 100 for precision)
     * @return count The number of ratings
     */
    function getAverageRating(uint256 movieId) external view returns (uint256 average, uint256 count) {
        Rating[] memory ratings = movieRatings[movieId];
        count = ratings.length;

        if (count == 0) {
            return (0, 0);
        }

        uint256 sum = 0;
        for (uint256 i = 0; i < count; i++) {
            sum += ratings[i].rating;
        }

        // Return average scaled by 100 (e.g., 750 = 7.50)
        average = (sum * 100) / count;
        return (average, count);
    }

    /**
     * @dev Get all review IDs for a movie
     * @param movieId The TMDB movie ID
     * @return Array of review IDs
     */
    function getMovieReviewIds(uint256 movieId) external view returns (uint256[] memory) {
        return movieReviews[movieId];
    }

    /**
     * @dev Get review details by ID
     * @param reviewId The review ID
     * @return Review struct
     */
    function getReview(uint256 reviewId) external view returns (Review memory) {
        require(reviewId < reviewCounter, "Review does not exist");
        return reviews[reviewId];
    }

    /**
     * @dev Get multiple reviews by IDs
     * @param reviewIds Array of review IDs
     * @return Array of Review structs
     */
    function getReviews(uint256[] memory reviewIds) external view returns (Review[] memory) {
        Review[] memory result = new Review[](reviewIds.length);
        for (uint256 i = 0; i < reviewIds.length; i++) {
            if (reviewIds[i] < reviewCounter) {
                result[i] = reviews[reviewIds[i]];
            }
        }
        return result;
    }

    /**
     * @dev Check if user has reviewed a movie
     * @param movieId The TMDB movie ID
     * @param user The user address
     * @return bool
     */
    function userHasReviewed(uint256 movieId, address user) external view returns (bool) {
        return hasReviewed[movieId][user];
    }

    /**
     * @dev Check if user has rated a movie
     * @param movieId The TMDB movie ID
     * @param user The user address
     * @return bool
     */
    function userHasRated(uint256 movieId, address user) external view returns (bool) {
        return hasRated[movieId][user];
    }

    /**
     * @dev Get total number of reviews
     * @return uint256
     */
    function getTotalReviews() external view returns (uint256) {
        return reviewCounter;
    }
}
