# Moview - Onchain Movie Review Platform

A decentralized movie review and discussion platform built on Celo Sepolia testnet, integrating TMDB API for movie data with blockchain-based ratings and reviews.

## Features

- 🎬 **Movie Discovery**: Search and browse thousands of movies via TMDB API
- ⭐ **Onchain Ratings**: Rate movies 1-10 with blockchain transparency
- 💬 **Decentralized Reviews**: Write and read immutable reviews stored onchain
- 👍 **Community Engagement**: Like reviews and see community ratings
- 🔐 **Wallet Authentication**: Connect with MetaMask, MiniPay, or other wallets
- 🌐 **Browse Without Wallet**: Explore movies without connecting (connect to rate/review)

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **Blockchain**: Solidity, Hardhat, Celo Sepolia Testnet
- **Wallet Integration**: RainbowKit, Wagmi v2
- **Movie Data**: TMDB API v3

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- TMDB API key ([Get one here](https://www.themoviedb.org/settings/api))
- WalletConnect Project ID ([Get one here](https://cloud.walletconnect.com/))

### Installation

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:

Create `.env.local` file in the root directory:
```env
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
NEXT_PUBLIC_CONTRACT_ADDRESS=
```

3. **Deploy the smart contract**:

Create `.env` file in the root directory:
```env
PRIVATE_KEY=your_wallet_private_key_here
CELOSCAN_API_KEY=your_celoscan_api_key_here
```

Install Hardhat dependencies and deploy:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts
npx hardhat compile
npx hardhat run scripts/deploy.ts --network celoSepolia
```

Copy the deployed contract address and add it to `.env.local`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

4. **Run the development server**:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Get Test CELO

To interact with the platform, you'll need test CELO tokens:
1. Visit [Celo Faucet](https://faucet.celo.org/alfajores)
2. Enter your wallet address
3. Request test tokens

## Smart Contract

The `MovieReviews` contract is deployed on Celo Sepolia testnet and includes:

- **addRating**: Submit a 1-10 rating for a movie
- **addReview**: Submit a review with rating (max 1000 characters)
- **likeReview**: Like a review
- **unlikeReview**: Unlike a review
- **getAverageRating**: Get average rating and count for a movie
- **getMovieReviews**: Get all reviews for a movie

## Project Structure

```
moview/
├── app/                    # Next.js app directory
│   ├── movie/[id]/        # Movie details page
│   ├── search/            # Search results page
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx         # Navigation header
│   ├── MovieCard.tsx      # Movie card component
│   ├── MovieReviews.tsx   # Reviews section
│   ├── RatingInput.tsx    # Rating input (1-10)
│   ├── RatingStars.tsx    # Star rating display
│   ├── ReviewCard.tsx     # Review display
│   └── ReviewForm.tsx     # Review submission form
├── config/                # Configuration
│   └── contract.ts        # Contract ABI and address
├── contracts/             # Smart contracts
│   └── MovieReviews.sol   # Main contract
├── scripts/               # Deployment scripts
│   └── deploy.ts          # Contract deployment
├── services/              # API services
│   └── tmdb.ts           # TMDB API integration
└── hardhat.config.ts      # Hardhat configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
