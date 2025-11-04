import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import { insertArtworkSchema, insertTicketSchema, insertVoteSchema } from "@shared/schema";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users/me/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      let user = await storage.getUserByWallet(walletAddress);
      
      if (!user) {
        // Create new user if doesn't exist
        user = await storage.createUser({
          walletAddress,
          role: 'visitor',
          isDaoMember: false,
        });
      }
      
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const user = await storage.createUser(req.body);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Artwork routes
  app.get("/api/artworks", async (req, res) => {
    try {
      const artworks = await storage.getAllArtworks();
      res.json(artworks);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/artworks/my/:artistAddress", async (req, res) => {
    try {
      const { artistAddress } = req.params;
      const artworks = await storage.getArtworksByArtist(artistAddress);
      res.json(artworks);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/artworks/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { title, description, price, royaltyPercentage, artistAddress } = req.body;

      // Upload to Pinata IPFS
      const formData = new FormData();
      formData.append('file', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      const pinataMetadata = JSON.stringify({
        name: `${title} - Decentralized Museum`,
      });
      formData.append('pinataMetadata', pinataMetadata);

      const pinataResponse = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            'Authorization': `Bearer ${process.env.PINATA_API_KEY}`,
          },
        }
      );

      const ipfsHash = pinataResponse.data.IpfsHash;

      // Create metadata JSON
      const metadata = {
        name: title,
        description,
        image: `ipfs://${ipfsHash}`,
        attributes: [
          { trait_type: "Artist", value: artistAddress },
          { trait_type: "Price", value: price || "Not for sale" },
          { trait_type: "Royalty", value: `${royaltyPercentage}%` },
        ],
      };

      // Upload metadata to IPFS
      const metadataResponse = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        metadata,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.PINATA_API_KEY}`,
          },
        }
      );

      const metadataHash = metadataResponse.data.IpfsHash;
      const metadataUri = `ipfs://${metadataHash}`;

      // Save to storage (in production, this would be after blockchain minting)
      const tokenId = `token-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      
      const artwork = await storage.createArtwork({
        tokenId,
        title,
        description,
        artistAddress,
        artistName: undefined,
        ipfsHash,
        metadataUri,
        contractAddress: undefined,
        price: price || undefined,
        royaltyPercentage: royaltyPercentage || "5",
      });

      res.json({
        success: true,
        artwork,
        ipfsHash,
        metadataUri,
        message: "Artwork uploaded to IPFS successfully. Ready to mint NFT!",
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      res.status(500).json({ error: error.message || "Failed to upload artwork" });
    }
  });

  // Ticket routes
  app.post("/api/tickets/purchase", async (req, res) => {
    try {
      const { ticketType, amount } = req.body;
      const visitorAddress = req.body.visitorAddress || req.headers['x-wallet-address'];

      if (!visitorAddress) {
        return res.status(400).json({ error: "Visitor address required" });
      }

      const ticketPrices: Record<string, string> = {
        general: "0.01",
        premium: "0.02",
        vip: "0.05",
      };

      const price = ticketPrices[ticketType];
      if (!price) {
        return res.status(400).json({ error: "Invalid ticket type" });
      }

      const ticket = await storage.createTicket({
        visitorAddress: visitorAddress as string,
        ticketType,
        price,
        transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`, // Mock tx hash
      });

      res.json({
        success: true,
        ticket,
        message: "Ticket purchased successfully!",
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // DAO routes
  app.post("/api/dao/join", async (req, res) => {
    try {
      const walletAddress = req.body.walletAddress || req.headers['x-wallet-address'];

      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address required" });
      }

      let user = await storage.getUserByWallet(walletAddress as string);
      
      if (!user) {
        user = await storage.createUser({
          walletAddress: walletAddress as string,
          role: 'visitor',
          isDaoMember: true,
        });
      } else {
        user = await storage.updateUser(user.id, { isDaoMember: true });
      }

      res.json({
        success: true,
        user,
        message: "Successfully joined the DAO!",
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Proposal routes
  app.get("/api/proposals", async (req, res) => {
    try {
      const proposals = await storage.getAllProposals();
      res.json(proposals);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/proposals", async (req, res) => {
    try {
      const proposal = await storage.createProposal(req.body);
      res.json(proposal);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/proposals/vote", async (req, res) => {
    try {
      const { proposalId, voteType } = req.body;
      const voterAddress = req.body.voterAddress || req.headers['x-wallet-address'];

      if (!voterAddress) {
        return res.status(400).json({ error: "Voter address required" });
      }

      // Check if user already voted
      const existingVote = await storage.getVoteByUser(proposalId, voterAddress as string);
      if (existingVote) {
        return res.status(400).json({ error: "You have already voted on this proposal" });
      }

      // Create vote
      const vote = await storage.createVote({
        proposalId,
        voterAddress: voterAddress as string,
        voteType,
        votingPower: "1", // In production, this would be based on token balance
      });

      // Update proposal vote counts
      const proposals = await storage.getAllProposals();
      const proposal = proposals.find(p => p.proposalId === proposalId);
      
      if (proposal) {
        const updates: any = {};
        if (voteType === 'for') {
          updates.votesFor = proposal.votesFor + 1;
        } else if (voteType === 'against') {
          updates.votesAgainst = proposal.votesAgainst + 1;
        } else if (voteType === 'abstain') {
          updates.votesAbstain = proposal.votesAbstain + 1;
        }

        await storage.updateProposal(proposal.id, updates);
      }

      res.json({
        success: true,
        vote,
        message: "Vote submitted successfully!",
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
