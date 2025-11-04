# Decentralized Museum - Where Culture Meets Blockchain

## Overview
A complete Ethereum-based web dApp that brings art, culture, and blockchain together. Artists can upload and mint artwork NFTs stored on IPFS, visitors can explore the virtual museum and buy tickets using crypto tokens, and DAO members can vote on which exhibits and events are added.

## Project Status
**Current Phase:** MVP Development - Phase 3 In Progress (Integration & Testing)
**Phases Complete:** Phase 1 (Schema & Frontend), Phase 2 (Smart Contracts & Backend)
**Last Updated:** November 4, 2025

## Architecture

### Frontend (React + TypeScript)
- **Framework:** React with Vite, TypeScript, TailwindCSS
- **Web3 Integration:** Ethers.js v6 for blockchain interaction
- **Design System:** Shadcn UI components with custom museum aesthetic
- **Animations:** Framer Motion for smooth transitions
- **State Management:** TanStack Query for server state
- **Routing:** Wouter for client-side routing

### Backend (Node.js + Express)
- **Server:** Express.js with TypeScript
- **Storage:** In-memory storage (MemStorage) for development
- **IPFS Integration:** Pinata API for decentralized file storage
- **File Uploads:** Multer middleware for handling artwork uploads

### Smart Contracts (Solidity + Hardhat)
- **ERC-721 NFT Contract:** For artwork ownership with royalty tracking
- **ERC-20 Token Contract:** For ticket payments and DAO governance tokens
- **Governor DAO Contract:** OpenZeppelin Governor for decentralized governance
- **Deployment:** Sepolia testnet via Alchemy RPC

## Key Features

### 1. Home Page
- Professional hero section with tagline "Where Culture Meets Blockchain"
- Smooth Framer Motion animations
- Call-to-action buttons for entering museum, artist portal, and DAO
- Features showcase with elegant design

### 2. Museum Gallery
- Grid layout displaying all minted NFT artworks
- Images loaded from IPFS via Pinata gateway
- Card-based design with hover effects
- Artist information and artwork metadata display

### 3. Artist Dashboard
- Artwork upload form with drag-and-drop functionality
- Live preview of artwork before minting
- IPFS integration for decentralized storage
- NFT minting interface
- Track personal artwork collection

### 4. Visitor Dashboard
- Three ticket tiers: General, Premium, VIP
- Crypto payment integration with ERC-20 tokens
- DAO membership registration
- Benefits overview for DAO membership

### 5. DAO Governance
- View all active and past proposals
- Vote on proposals (For, Against, Abstain)
- Real-time voting statistics and progress bars
- Quorum tracking
- Member-only voting access

### 6. Wallet Integration
- MetaMask wallet connection
- Persistent wallet sessions
- Account switching detection
- Network change handling
- Wallet address display with truncation

## Design System

### Color Palette
- **Primary (Gold):** HSL(35, 65%, 28%) - Sophisticated gold accent
- **Background:** Off-white/Charcoal based on theme
- **Typography:** Playfair Display (serif), Inter (sans), Space Mono (mono)
- **Aesthetic:** Elegant museum vibe with neutral tones

### Typography
- **Headings:** Playfair Display (serif) for elegance
- **Body:** Inter (sans-serif) for readability
- **Technical:** Space Mono (monospace) for addresses and tokens

### Components
- All components follow museum gallery aesthetic
- Consistent spacing: 6, 8, 12, 16, 24, 32px
- Hover effects with subtle scale transformations
- Loading states with skeleton screens
- Empty states with elegant iconography

## Pages & Routes
- `/` - Home page with hero and features
- `/gallery` - Museum gallery of all NFT artworks
- `/artist` - Artist dashboard for uploading and minting
- `/visitor` - Visitor dashboard for tickets and DAO membership
- `/dao` - DAO governance voting page

## Environment Variables
```
PINATA_API_KEY=<Pinata API key>
PINATA_SECRET_API_KEY=<Pinata secret key>
SEPOLIA_RPC_URL=<Alchemy Sepolia RPC URL>
PRIVATE_KEY=<Ethereum wallet private key for deployment>
SESSION_SECRET=<Express session secret>
```

## Data Models

### User
- `walletAddress`: Ethereum wallet address
- `role`: 'artist' | 'visitor'
- `isDaoMember`: Boolean flag for DAO membership

### Artwork
- `tokenId`: Unique NFT token identifier
- `title`: Artwork title
- `description`: Artwork description
- `artistAddress`: Creator's wallet address
- `ipfsHash`: IPFS CID for artwork image
- `metadataUri`: Full IPFS URI for metadata
- `price`: Price in ETH
- `royaltyPercentage`: Royalty % for resales

### Ticket
- `visitorAddress`: Purchaser's wallet address
- `ticketType`: 'general' | 'premium' | 'vip'
- `price`: Ticket price in ETH
- `transactionHash`: Blockchain transaction hash

### Proposal
- `proposalId`: Unique proposal identifier
- `title`: Proposal title
- `description`: Proposal details
- `proposalType`: 'exhibit' | 'event' | 'governance'
- `votesFor/Against/Abstain`: Vote tallies
- `status`: 'active' | 'passed' | 'rejected' | 'executed'
- `startTime/endTime`: Voting period

### Vote
- `proposalId`: Reference to proposal
- `voterAddress`: Voter's wallet address
- `voteType`: 'for' | 'against' | 'abstain'
- `votingPower`: Governance token balance

## Recent Changes (Phase 1)
- ✅ Created complete data schema for all entities
- ✅ Configured design tokens (colors, typography, spacing)
- ✅ Generated hero background and NFT placeholder images
- ✅ Built Web3Context provider for wallet management
- ✅ Created Header component with navigation and wallet button
- ✅ Built Home page with hero section and features
- ✅ Built Gallery page with NFT grid layout
- ✅ Built Artist Dashboard with upload form and preview
- ✅ Built Visitor Dashboard with ticket purchase and DAO join
- ✅ Built DAO Governance page with proposal voting
- ✅ Created 404 Not Found page
- ✅ Set up routing with wouter
- ✅ Updated storage interface for all CRUD operations
- ✅ Added sample proposal data for demonstration

## Recent Changes (Phase 2)
- ✅ Set up Hardhat development environment with Sepolia configuration
- ✅ Created MuseumNFT contract (ERC-721) with royalty tracking
- ✅ Created MuseumToken contract (ERC-20) for tickets and governance
- ✅ Created MuseumDAO contract using OpenZeppelin Governor
- ✅ Implemented deployment script for Sepolia testnet
- ✅ Created all backend API endpoints:
  - User management (get/create users by wallet)
  - Artwork upload to IPFS via Pinata
  - Artwork retrieval (all artworks, by artist)
  - Ticket purchase endpoints
  - DAO join endpoint
  - Proposal listing and voting endpoints
- ✅ Integrated IPFS metadata upload for NFTs
- ✅ Added sample proposals for demonstration
- ✅ Created comprehensive README.md
- ✅ Created .env.example template

## Recent Changes (Phase 3)
- ✅ Fixed FormData upload issue - now using fetch directly for artwork uploads
- ✅ Created ContractService class with ethers.js integration layer
- ✅ Integrated frontend components with backend APIs
- ✅ Added proper wallet address passing in all API calls
- ✅ Fixed React errors (nested anchor tags, Link usage)
- ✅ Created comprehensive DEPLOYMENT_GUIDE.md
- ✅ Contract integration layer ready for activation after deployment

## Current Application State

**MVP Status**: ✅ Fully Functional (Backend Mode)

The application is currently running in **hybrid mode**:
- **Frontend**: Beautiful, responsive UI with all features implemented
- **Backend**: Fully functional REST API with IPFS integration
- **Smart Contracts**: Written and ready to deploy (not yet deployed)
- **Blockchain Integration**: Contract service layer created, ready to activate

### What Works Now (Without Contract Deployment)

All features work through the backend API:
1. **Artist Portal**: Upload artwork to IPFS, store metadata, view collection
2. **Gallery**: Browse all minted artworks with images from IPFS
3. **Visitor Portal**: Purchase tickets, join DAO
4. **DAO Governance**: View and vote on proposals
5. **Wallet Integration**: MetaMask connection, wallet address display

### Next Steps for Full Blockchain Integration

To enable on-chain functionality:
1. User deploys smart contracts to Sepolia using `npx hardhat run scripts/deploy.ts --network sepolia`
2. User adds contract addresses to `.env` file
3. Update frontend mutations to call ContractService methods
4. Restart application to use blockchain integration

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

## Technical Notes
- Using in-memory storage for development (will need database for production)
- MetaMask required for all Web3 interactions
- IPFS gateway: `https://gateway.pinata.cloud/ipfs/`
- Testnet: Sepolia (ChainID: 11155111)
- All timestamps use JavaScript Date objects
- Vote tallies updated in real-time on proposal objects

## User Preferences
- Professional, production-quality code and styling required
- Sleek, modern UI with digital museum aesthetic
- Smooth transitions and responsive design mandatory
- Gallery-first mentality with generous whitespace
- All features must be fully functional (no mock data in final version)
