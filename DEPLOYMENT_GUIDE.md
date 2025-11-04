# Deployment Guide for Decentralized Museum

This guide explains how to deploy the smart contracts and configure the dApp for full blockchain integration.

## Current Status

The application is currently running in **hybrid mode**:
- ✅ Frontend UI fully functional with elegant design
- ✅ Backend API working for all features
- ✅ IPFS integration via Pinata operational
- ✅ In-memory storage for development data
- ⚠️ Smart contracts written but not deployed
- ⚠️ Blockchain integration layer created but not connected

## What Works Now (Without Contract Deployment)

1. **Artist Portal**: Upload artwork images to IPFS, preview artwork
2. **Gallery**: Browse uploaded artworks
3. **Visitor Portal**: View ticket options and DAO membership info
4. **DAO Governance**: View sample proposals

## What Requires Contract Deployment

To enable full blockchain functionality, you need to:

1. **Deploy Smart Contracts to Sepolia**
2. **Configure Contract Addresses**
3. **Connect Frontend to Contracts**

### Step 1: Get Sepolia Testnet ETH

You need Sepolia ETH in your deployment wallet to pay for gas fees:

1. Visit [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
2. Enter your wallet address
3. Request test ETH (you'll receive ~0.5 ETH)

### Step 2: Deploy Contracts

```bash
# Compile the contracts
npx hardhat compile

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.ts --network sepolia
```

The script will output three contract addresses:
```
MuseumToken: 0x...
MuseumNFT: 0x...
MuseumDAO: 0x...
```

### Step 3: Configure Environment Variables

Add the contract addresses to your `.env` file:

```bash
# Add these lines to .env
VITE_MUSEUM_TOKEN_ADDRESS=0x... # Your MuseumToken address
VITE_MUSEUM_NFT_ADDRESS=0x...   # Your MuseumNFT address
VITE_MUSEUM_DAO_ADDRESS=0x...   # Your MuseumDAO address
```

### Step 4: Update Frontend to Use Contracts

The contract integration layer is ready in `client/src/lib/contracts.ts`. To enable it:

1. Uncomment the contract calls in the mutation functions
2. Restart the application to load the new environment variables
3. Test each feature with MetaMask

### Step 5: Get Test Tokens

Once contracts are deployed, users can get test tokens:

1. Connect wallet to the app
2. Call the faucet function (will be added to UI)
3. Receive 1000 MTKN tokens for testing

## Testing the Full Flow

### Artist Workflow
1. Connect MetaMask wallet
2. Go to Artist Portal
3. Upload artwork image (stored on IPFS)
4. Call `mintArtwork()` on MuseumNFT contract
5. Artwork appears in gallery with on-chain token ID

### Visitor Workflow
1. Connect MetaMask wallet
2. Get test tokens from faucet
3. Go to Visitor Portal
4. Purchase ticket (calls `purchaseTicket()` on MuseumToken)
5. Join DAO (calls `joinDao()` on MuseumToken, receive governance tokens)

### DAO Governance Workflow
1. Be a DAO member (have governance tokens)
2. View proposals on DAO page
3. Vote on proposal (calls `castVote()` on MuseumDAO)
4. Vote recorded on blockchain

## Contract Addresses (After Deployment)

Update these in your environment:

- **MuseumToken (ERC-20)**: `[Not deployed yet]`
- **MuseumNFT (ERC-721)**: `[Not deployed yet]`
- **MuseumDAO (Governor)**: `[Not deployed yet]`
- **Network**: Sepolia Testnet (Chain ID: 11155111)

## Verifying Contracts on Etherscan

After deployment, verify your contracts for transparency:

```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

## Production Considerations

For mainnet deployment:

1. **Security Audit**: Have contracts audited by professionals
2. **Database**: Replace in-memory storage with PostgreSQL
3. **IPFS**: Consider dedicated IPFS node or Pinata Pro
4. **Gas Optimization**: Review contract gas usage
5. **Access Control**: Implement proper role-based permissions
6. **Frontend**: Deploy to production CDN/hosting
7. **Monitoring**: Set up contract event monitoring
8. **Backup**: Implement database backup strategy

## Troubleshooting

### "Contract not deployed" Error
- Ensure contracts are deployed to Sepolia
- Verify environment variables are set correctly
- Restart the development server after adding env vars

### Transaction Fails
- Check you have enough Sepolia ETH for gas
- Verify you're connected to Sepolia network in MetaMask
- Check contract addresses are correct

### IPFS Upload Fails
- Verify Pinata API keys are correct
- Check file size is under 10MB
- Ensure stable internet connection

## Support

For deployment issues:
- Check Hardhat documentation
- Review contract deployment logs
- Test contracts on local Hardhat network first
- Join Replit community for help

---

**Note**: The current MVP is fully functional for demonstration and testing without contract deployment. Full blockchain integration requires the steps above.
