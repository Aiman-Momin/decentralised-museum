import type { User, InsertUser, Artwork, InsertArtwork, Ticket, InsertTicket, Proposal, InsertProposal, Vote, InsertVote } from "../shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByWallet(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Artwork operations
  getAllArtworks(): Promise<Artwork[]>;
  getArtworksByArtist(artistAddress: string): Promise<Artwork[]>;
  getArtwork(id: string): Promise<Artwork | undefined>;
  createArtwork(artwork: InsertArtwork): Promise<Artwork>;

  // Ticket operations
  getTicketsByVisitor(visitorAddress: string): Promise<Ticket[]>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  hasValidTicket(visitorAddress: string): Promise<boolean>;

  // Proposal operations
  getAllProposals(): Promise<Proposal[]>;
  getProposal(id: string): Promise<Proposal | undefined>;
  createProposal(proposal: InsertProposal): Promise<Proposal>;
  updateProposal(id: string, updates: Partial<Proposal>): Promise<Proposal | undefined>;

  // Vote operations
  getVotesByProposal(proposalId: string): Promise<Vote[]>;
  getVoteByUser(proposalId: string, voterAddress: string): Promise<Vote | undefined>;
  createVote(vote: InsertVote): Promise<Vote>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private artworks: Map<string, Artwork>;
  private tickets: Map<string, Ticket>;
  private proposals: Map<string, Proposal>;
  private votes: Map<string, Vote>;

  constructor() {
    this.users = new Map();
    this.artworks = new Map();
    this.tickets = new Map();
    this.proposals = new Map();
    this.votes = new Map();

    // Seed with sample proposals
    this.seedSampleData();
  }

  private seedSampleData() {
    const sampleProposals: Proposal[] = [
      {
        id: randomUUID(),
        proposalId: 'prop-1',
        title: 'Add Contemporary Digital Art Exhibition',
        description: 'Proposal to feature a special exhibition showcasing emerging digital artists and NFT creators from around the world.',
        proposerAddress: '0x0000000000000000000000000000000000000000',
        proposalType: 'exhibit',
        votesFor: 15,
        votesAgainst: 3,
        votesAbstain: 2,
        status: 'active',
        startTime: new Date(),
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        proposalId: 'prop-2',
        title: 'Virtual Reality Gallery Experience',
        description: 'Introduce VR technology to allow visitors to experience artworks in immersive 3D environments.',
        proposerAddress: '0x0000000000000000000000000000000000000000',
        proposalType: 'event',
        votesFor: 22,
        votesAgainst: 8,
        votesAbstain: 5,
        status: 'active',
        startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ];

    sampleProposals.forEach(proposal => {
      this.proposals.set(proposal.id, proposal);
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress.toLowerCase() === walletAddress.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      isDaoMember: insertUser.isDaoMember ?? false,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Artwork operations
  async getAllArtworks(): Promise<Artwork[]> {
    return Array.from(this.artworks.values()).sort(
      (a, b) => b.mintedAt.getTime() - a.mintedAt.getTime()
    );
  }

  async getArtworksByArtist(artistAddress: string): Promise<Artwork[]> {
    return Array.from(this.artworks.values())
      .filter(artwork => artwork.artistAddress.toLowerCase() === artistAddress.toLowerCase())
      .sort((a, b) => b.mintedAt.getTime() - a.mintedAt.getTime());
  }

  async getArtwork(id: string): Promise<Artwork | undefined> {
    return this.artworks.get(id);
  }

  async createArtwork(insertArtwork: InsertArtwork): Promise<Artwork> {
    const id = randomUUID();
    const artwork: Artwork = { 
      ...insertArtwork, 
      id,
      artistName: insertArtwork.artistName ?? null,
      imageData: insertArtwork.imageData ?? null,
      contractAddress: insertArtwork.contractAddress ?? null,
      price: insertArtwork.price ?? null,
      royaltyPercentage: insertArtwork.royaltyPercentage ?? "5",
      mintedAt: new Date(),
    };
    this.artworks.set(id, artwork);
    return artwork;
  }

  // Ticket operations
  async getTicketsByVisitor(visitorAddress: string): Promise<Ticket[]> {
    return Array.from(this.tickets.values())
      .filter(ticket => ticket.visitorAddress.toLowerCase() === visitorAddress.toLowerCase())
      .sort((a, b) => b.purchasedAt.getTime() - a.purchasedAt.getTime());
  }

  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    const id = randomUUID();
    const ticket: Ticket = { 
      ...insertTicket, 
      id,
      transactionHash: insertTicket.transactionHash ?? null,
      purchasedAt: new Date(),
    };
    this.tickets.set(id, ticket);
    return ticket;
  }

  async hasValidTicket(visitorAddress: string): Promise<boolean> {
    const tickets = await this.getTicketsByVisitor(visitorAddress);
    return tickets.length > 0;
  }

  // Proposal operations
  async getAllProposals(): Promise<Proposal[]> {
    return Array.from(this.proposals.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getProposal(id: string): Promise<Proposal | undefined> {
    return this.proposals.get(id);
  }

  async createProposal(insertProposal: InsertProposal): Promise<Proposal> {
    const id = randomUUID();
    const proposal: Proposal = { 
      ...insertProposal, 
      id,
      votesFor: 0,
      votesAgainst: 0,
      votesAbstain: 0,
      status: 'active',
      startTime: insertProposal.startTime ?? new Date(),
      createdAt: new Date(),
    };
    this.proposals.set(id, proposal);
    return proposal;
  }

  async updateProposal(id: string, updates: Partial<Proposal>): Promise<Proposal | undefined> {
    const proposal = this.proposals.get(id);
    if (!proposal) return undefined;
    const updatedProposal = { ...proposal, ...updates };
    this.proposals.set(id, updatedProposal);
    return updatedProposal;
  }

  // Vote operations
  async getVotesByProposal(proposalId: string): Promise<Vote[]> {
    return Array.from(this.votes.values())
      .filter(vote => vote.proposalId === proposalId)
      .sort((a, b) => b.votedAt.getTime() - a.votedAt.getTime());
  }

  async getVoteByUser(proposalId: string, voterAddress: string): Promise<Vote | undefined> {
    return Array.from(this.votes.values()).find(
      vote => vote.proposalId === proposalId && 
              vote.voterAddress.toLowerCase() === voterAddress.toLowerCase()
    );
  }

  async createVote(insertVote: InsertVote): Promise<Vote> {
    const id = randomUUID();
    const vote: Vote = { 
      ...insertVote, 
      id,
      votedAt: new Date(),
    };
    this.votes.set(id, vote);
    return vote;
  }
}

export const storage = new MemStorage();
