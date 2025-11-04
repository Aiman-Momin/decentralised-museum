# Decentralized Museum - Where Culture Meets Blockchain

A complete Ethereum-based web dApp that brings art, culture, and blockchain together. Artists can upload and mint artwork NFTs stored on IPFS, visitors can explore the virtual museum and buy tickets using crypto tokens, and DAO members can vote on which exhibits and events are added.

## Features

- 🎨 **Artist Portal**: Upload artwork, store on IPFS, and mint NFTs with royalty tracking
- 🖼️ **Virtual Gallery**: Browse blockchain-verified artworks in an elegant digital museum
- 🎫 **Crypto Tickets**: Purchase museum access with ERC-20 tokens
- 🗳️ **DAO Governance**: Vote on proposals for new exhibitions and events
- 💰 **Royalty System**: Built-in royalty tracking for artist earnings
- 🔐 **MetaMask Integration**: Secure wallet connection and transactions

## Tech Stack

### Frontend
- React + TypeScript + Vite
- TailwindCSS + Shadcn UI components
- Framer Motion for animations
- Ethers.js v6 for Web3 interactions
- TanStack Query for state management

### Backend
- Node.js + Express + TypeScript
- Pinata API for IPFS storage
- In-memory storage (development)

### Smart Contracts
- Solidity ^0.8.20
- Hardhat development environment
- OpenZeppelin contracts
- ERC-721 for NFTs
- ERC-20 for tokens
- Governor for DAO

## Getting Started

### Prerequisites

1. **Node.js** (v18 or higher)
2. **MetaMask** browser extension
3. **Sepolia Testnet ETH** (get from [Alchemy faucet](https://sepoliafaucet.com/))
4. **Pinata Account** for IPFS (free at [pinata.cloud](https://pinata.cloud))
5. **Alchemy Account** for RPC (free at [alchemy.com](https://www.alchemy.com))

### Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env`
3. Fill in your credentials:
   - Get Pinata API keys from your Pinata dashboard
   - Get Alchemy Sepolia RPC URL from your Alchemy app
   - Export your MetaMask private key (use a test wallet only!)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`

### Deploy Smart Contracts

```bash
# Compile contracts
npx hardhat compile

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.ts --network sepolia

# Copy the contract addresses to your .env file
```

## Smart Contracts

### MuseumNFT (ERC-721)
- Mint artwork NFTs with IPFS metadata
- Track original artist and royalties
- Royalty percentage up to 10%

### MuseumToken (ERC-20)
- Used for ticket purchases and DAO governance
- Faucet function for testing (gives 1000 tokens)
- Ticket prices: General (10), Premium (20), VIP (50)
- DAO membership: 100 tokens

### MuseumDAO (Governor)
- OpenZeppelin Governor-based DAO
- Proposals for exhibits, events, and governance
- 1-week voting period
- 4% quorum requirement

## Usage

### For Artists

1. Connect your MetaMask wallet
2. Navigate to Artist Portal
3. Upload your artwork (image file)
4. Fill in title, description, price, and royalty percentage
5. Click "Upload & Mint NFT"
6. Artwork is stored on IPFS and ready to mint on blockchain

### For Visitors

1. Connect your MetaMask wallet
2. Browse the Gallery to view artworks
3. Visit Visitor Portal to purchase tickets
4. Join the DAO to participate in governance

### For DAO Members

1. Purchase DAO membership (100 tokens)
2. Navigate to DAO Governance page
3. View active proposals
4. Vote For, Against, or Abstain on proposals
5. Track voting statistics and quorum

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   └── lib/           # Web3 context and utilities
├── server/                # Express backend
│   ├── routes.ts          # API endpoints
│   └── storage.ts         # Data storage layer
├── contracts/             # Solidity smart contracts
│   ├── MuseumNFT.sol
│   ├── MuseumToken.sol
│   └── MuseumDAO.sol
├── scripts/               # Deployment scripts
└── shared/                # Shared TypeScript types
```

## API Endpoints

- `GET /api/artworks` - Get all artworks
- `POST /api/artworks/upload` - Upload artwork to IPFS
- `GET /api/artworks/my/:address` - Get artworks by artist
- `POST /api/tickets/purchase` - Purchase museum ticket
- `POST /api/dao/join` - Join DAO
- `GET /api/proposals` - Get all proposals
- `POST /api/proposals/vote` - Vote on proposal
- `GET /api/users/me/:address` - Get user profile

## Design System

- **Primary Color**: Gold (HSL 35, 65%, 28%)
- **Typography**: Playfair Display (serif), Inter (sans), Space Mono (mono)
- **Aesthetic**: Elegant museum gallery with neutral tones
- **Animations**: Smooth Framer Motion transitions
- **Responsive**: Mobile-first design with breakpoints

## Development

```bash
# Run development server
npm run dev

# Compile smart contracts
npx hardhat compile

# Run contract tests
npx hardhat test

# Deploy to Sepolia
npx hardhat run scripts/deploy.ts --network sepolia
```

## Testing

The application uses Sepolia testnet for development:
- **Network**: Sepolia
- **Chain ID**: 11155111
- **RPC**: Alchemy Sepolia endpoint

Get free Sepolia ETH from:
- [Alchemy Faucet](https://sepoliafaucet.com/)
- [Chainlink Faucet](https://faucets.chain.link/sepolia)

## Security Notes

- Never use your mainnet wallet private key
- Create a dedicated test wallet for development
- Keep your `.env` file secure and never commit it
- API keys should have minimal permissions

## License

MIT

## Support

For issues and questions:
- Check the documentation in `replit.md`
- Review smart contract code in `contracts/`
- Examine API routes in `server/routes.ts`

---

**Built with ❤️ for the Decentralized Web**
