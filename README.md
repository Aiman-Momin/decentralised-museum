# 🎨 Decentralized Museum - Web3 dApp

A decentralized museum platform built with Ethereum blockchain, allowing artists to mint and sell NFT artworks, visitors to purchase gallery tickets and artwork, and community members to participate in DAO governance.

## ✨ Features

### 🔐 Authentication & Roles
- **MetaMask Web3 Authentication** - Connect wallet to sign in
- **Three User Roles:**
  - **Artist** - Mint and sell NFT artworks
  - **Visitor** - Purchase gallery tickets and buy artworks
  - **DAO Member** - Participate in museum governance

### 🎭 Role-Based Features

#### Artist Portal
- Upload artwork with metadata
- Mint NFTs with IPFS storage
- View minted artworks
- Set custom royalty percentages
- Track sales

#### Visitor Portal
- **Gallery Ticket System** - Purchase tickets to access gallery (fake payment, no Web3)
- Purchase gallery access
- View all NFT artworks
- Buy artworks with real ETH transactions
- View purchase history

#### DAO Governance
- Vote on new exhibitions
- Propose museum events
- Governance proposals
- Community decision-making

### 🖼️ Gallery Features
- Browse all minted NFT artworks
- View artwork details, artist info, and prices
- One-click artwork purchases
- Real-time MetaMask transaction handling
- Wallet balance checking before purchase

### 🎫 Ticket System
- Three ticket tiers: General (0.01 ETH), Premium (0.02 ETH), VIP (0.05 ETH)
- Instant gallery access after ticket purchase
- Lifetime access once purchased
- No Web3 required for tickets (fake payment for demo)

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool with HMR
- **TanStack React Query** - Data fetching & caching
- **ethers.js v6** - Web3 interactions
- **shadcn/ui** - Component library
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling

### Backend
- **Express.js** - HTTP server
- **TypeScript** - Type safety
- **Vite Middleware** - Development server
- **In-Memory Storage** - Session data

### Blockchain
- **Ethereum** - Smart contracts
- **OpenZeppelin** - Standard contracts
- **Hardhat** - Development environment
- **IPFS/Pinata** - Decentralized file storage

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- MetaMask browser extension
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/Aiman-Momin/DecentralizedMuseum.git
cd DecentralizedMuseum/DecentralizedMuseum

# Install dependencies
npm install

# Create .env file (see .env.example)
cp .env.example .env

# Configure your Pinata API keys (optional, has fallback)
# PINATA_API_KEY=your_key
# PINATA_SECRET_API_KEY=your_secret
```

### Running the Project

```bash
# Start development server (both frontend + backend)
$env:NODE_ENV="development"; npx tsx server/index.ts

# Server will run on http://localhost:5000
```

The development server includes:
- Express API on port 5000
- Vite frontend with HMR
- Automatic browser refresh

## 📋 User Flow

### Visitor Journey
1. **Sign Up** → Connect MetaMask wallet
2. **Select Role** → Choose "Visitor"
3. **Visit Gallery** → See locked gallery screen
4. **Purchase Ticket** → Select tier and click "Purchase" (no payment required for demo)
5. **View Gallery** → Instantly see all artworks
6. **Buy Artwork** → Click "Buy Now" and confirm MetaMask transaction

### Artist Journey
1. **Sign Up** → Connect MetaMask wallet
2. **Select Role** → Choose "Artist"
3. **Go to Artist Portal** → Upload artwork
4. **Set Metadata** → Add title, description, price, royalty %
5. **Upload Image** → Image stored in IPFS/local storage
6. **Mint NFT** → Creates ERC721 token
7. **View Sales** → Track purchases and earnings

### DAO Member Journey
1. **Sign Up** → Connect MetaMask wallet
2. **Join DAO** → Pay membership fee (0.05 ETH)
3. **Vote on Proposals** → Participate in governance
4. **Create Proposals** → Suggest new exhibitions/events

## 🔧 API Endpoints

### Authentication
- `POST /api/users/signup` - Register user
- `GET /api/users/me/:walletAddress` - Get user info

### Artworks
- `GET /api/artworks` - Get all artworks
- `GET /api/artworks/my/:artistAddress` - Get artist's artworks
- `POST /api/artworks/upload` - Upload new artwork
- `GET /api/images/:hash` - Serve artwork image

### Tickets
- `POST /api/tickets/purchase` - Purchase gallery ticket
- `GET /api/tickets/check/:visitorAddress` - Check ticket status

### DAO
- `POST /api/dao/join` - Join DAO
- `GET /api/proposals` - Get all proposals
- `POST /api/proposals/vote` - Vote on proposal

## 📁 Project Structure

```
DecentralizedMuseum/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Context & utilities
│   │   └── hooks/       # Custom hooks
│   └── index.html       # Entry HTML
├── server/              # Express backend
│   ├── index.ts         # Main server file
│   ├── routes.ts        # API routes
│   ├── storage.ts       # In-memory storage
│   └── vite.ts          # Vite integration
├── shared/              # Shared TypeScript
│   └── schema.ts        # Database schemas
├── contracts/           # Solidity smart contracts
│   ├── MuseumToken.sol  # ERC20 governance token
│   ├── MuseumNFT.sol    # ERC721 artwork NFT
│   └── MuseumDAO.sol    # DAO governance
├── scripts/             # Deployment scripts
└── package.json         # Dependencies
```

## 🔐 Security Features

- **Role-Based Access Control** - Protected routes by user role
- **Wallet Verification** - MetaMask authentication
- **Balance Checking** - Verify sufficient ETH before purchase
- **Transaction Receipts** - Record blockchain transactions
- **Environment Variables** - Secure API key storage

## 🎨 Customization

### Add More Ticket Tiers
Edit `client/src/components/GalleryAccess.tsx`:
```tsx
{ type: 'platinum', name: 'Platinum', price: 0.1, description: 'Exclusive benefits' }
```

### Change Prices
Update `server/routes.ts` ticket prices object:
```typescript
const ticketPrices: Record<string, string> = {
  general: "0.02",     // 0.02 ETH
  premium: "0.05",     // 0.05 ETH
  vip: "0.1",          // 0.1 ETH
};
```

### Customize Colors
Edit `tailwind.config.ts` for theme colors

## 📊 Database Schema

### Users
- `walletAddress` - Ethereum address
- `role` - 'artist' | 'visitor' | 'dao-member'
- `isDaoMember` - Boolean flag

### Artworks
- `tokenId` - Unique NFT identifier
- `title`, `description` - Artwork metadata
- `artistAddress` - Creator address
- `imageData` - Base64 image
- `price` - Sale price in ETH
- `royaltyPercentage` - Artist royalty

### Tickets
- `visitorAddress` - Buyer address
- `ticketType` - Tier selection
- `price` - Ticket cost
- `purchasedAt` - Timestamp

## 🚨 Known Limitations

- In-memory storage (data lost on restart)
- Fake ticket payment (demo only)
- No persistent database
- Limited to single server instance

## 📝 Future Enhancements

- [ ] PostgreSQL database
- [ ] Real payment processing
- [ ] Smart contract deployment to mainnet
- [ ] IPFS integration
- [ ] Email notifications
- [ ] User profiles with avatars
- [ ] Artwork search & filtering
- [ ] Advanced analytics dashboard
- [ ] Multi-chain support
- [ ] Mobile app

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

**Aiman Momin** - [@Aiman-Momin](https://github.com/Aiman-Momin)

## 🙏 Acknowledgments

- OpenZeppelin for smart contract libraries
- shadcn/ui for beautiful components
- Framer Motion for animations
- The Ethereum community

---

**Ready to explore decentralized art? Connect your wallet and start your museum journey!** 🎨✨
