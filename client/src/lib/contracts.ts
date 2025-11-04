import { ethers } from 'ethers';

// Contract ABIs (simplified for MVP - in production, import from artifacts)
const MUSEUM_NFT_ABI = [
  "function mintArtwork(address artist, string memory tokenURI, uint256 royaltyPercentage, uint256 price) public returns (uint256)",
  "function getCurrentTokenId() public view returns (uint256)",
  "function getRoyaltyInfo(uint256 tokenId) public view returns (address artist, uint256 royaltyAmount)",
  "event ArtworkMinted(uint256 indexed tokenId, address indexed artist, string tokenURI, uint256 royaltyPercentage, uint256 price)"
];

const MUSEUM_TOKEN_ABI = [
  "function purchaseTicket(string memory ticketType) public",
  "function joinDao() public",
  "function faucet() public",
  "function balanceOf(address account) public view returns (uint256)",
  "event TicketPurchased(address indexed buyer, string ticketType, uint256 amount)",
  "event DaoMembershipGranted(address indexed member, uint256 tokensReceived)"
];

const MUSEUM_DAO_ABI = [
  "function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description) public returns (uint256)",
  "function castVote(uint256 proposalId, uint8 support) public returns (uint256)",
  "function state(uint256 proposalId) public view returns (uint8)",
  "event ProposalCreated(uint256 proposalId, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, string description)",
  "event VoteCast(address indexed voter, uint256 proposalId, uint8 support, uint256 weight, string reason)"
];

// Note: These addresses should be set after deployment
// For MVP, we'll use environment variables or set them dynamically
export const CONTRACT_ADDRESSES = {
  MUSEUM_NFT: import.meta.env.VITE_MUSEUM_NFT_ADDRESS || '',
  MUSEUM_TOKEN: import.meta.env.VITE_MUSEUM_TOKEN_ADDRESS || '',
  MUSEUM_DAO: import.meta.env.VITE_MUSEUM_DAO_ADDRESS || '',
};

export class ContractService {
  private provider: ethers.BrowserProvider;
  private signer: ethers.Signer;

  constructor(provider: ethers.BrowserProvider, signer: ethers.Signer) {
    this.provider = provider;
    this.signer = signer;
  }

  // Museum NFT Contract Methods
  async mintArtwork(metadataUri: string, royaltyPercentage: number, price: string) {
    if (!CONTRACT_ADDRESSES.MUSEUM_NFT) {
      throw new Error('NFT contract not deployed. Please deploy contracts first.');
    }

    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.MUSEUM_NFT,
      MUSEUM_NFT_ABI,
      this.signer
    );

    const artistAddress = await this.signer.getAddress();
    const priceInWei = ethers.parseEther(price || '0');
    const royaltyBasisPoints = royaltyPercentage * 100; // Convert to basis points

    const tx = await contract.mintArtwork(
      artistAddress,
      metadataUri,
      royaltyBasisPoints,
      priceInWei
    );

    const receipt = await tx.wait();
    
    // Extract token ID from event
    const event = receipt.logs.find((log: any) => {
      try {
        const parsed = contract.interface.parseLog(log);
        return parsed?.name === 'ArtworkMinted';
      } catch {
        return false;
      }
    });

    let tokenId = '0';
    if (event) {
      const parsed = contract.interface.parseLog(event);
      tokenId = parsed?.args.tokenId.toString();
    }

    return { receipt, tokenId };
  }

  // Museum Token Contract Methods
  async getTokenBalance(address: string): Promise<string> {
    if (!CONTRACT_ADDRESSES.MUSEUM_TOKEN) {
      return '0';
    }

    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.MUSEUM_TOKEN,
      MUSEUM_TOKEN_ABI,
      this.provider
    );

    const balance = await contract.balanceOf(address);
    return ethers.formatEther(balance);
  }

  async purchaseTicket(ticketType: string) {
    if (!CONTRACT_ADDRESSES.MUSEUM_TOKEN) {
      throw new Error('Token contract not deployed. Please deploy contracts first.');
    }

    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.MUSEUM_TOKEN,
      MUSEUM_TOKEN_ABI,
      this.signer
    );

    const tx = await contract.purchaseTicket(ticketType);
    const receipt = await tx.wait();
    return receipt;
  }

  async joinDao() {
    if (!CONTRACT_ADDRESSES.MUSEUM_TOKEN) {
      throw new Error('Token contract not deployed. Please deploy contracts first.');
    }

    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.MUSEUM_TOKEN,
      MUSEUM_TOKEN_ABI,
      this.signer
    );

    const tx = await contract.joinDao();
    const receipt = await tx.wait();
    return receipt;
  }

  async claimFaucetTokens() {
    if (!CONTRACT_ADDRESSES.MUSEUM_TOKEN) {
      throw new Error('Token contract not deployed. Please deploy contracts first.');
    }

    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.MUSEUM_TOKEN,
      MUSEUM_TOKEN_ABI,
      this.signer
    );

    const tx = await contract.faucet();
    const receipt = await tx.wait();
    return receipt;
  }

  // Museum DAO Contract Methods
  async castVote(proposalId: string, support: number) {
    if (!CONTRACT_ADDRESSES.MUSEUM_DAO) {
      throw new Error('DAO contract not deployed. Please deploy contracts first.');
    }

    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.MUSEUM_DAO,
      MUSEUM_DAO_ABI,
      this.signer
    );

    // Support: 0 = Against, 1 = For, 2 = Abstain
    const tx = await contract.castVote(proposalId, support);
    const receipt = await tx.wait();
    return receipt;
  }
}

// Helper function to check if contracts are deployed
export function areContractsDeployed(): boolean {
  return !!(
    CONTRACT_ADDRESSES.MUSEUM_NFT &&
    CONTRACT_ADDRESSES.MUSEUM_TOKEN &&
    CONTRACT_ADDRESSES.MUSEUM_DAO
  );
}
