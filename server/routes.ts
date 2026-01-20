import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import { insertArtworkSchema, insertTicketSchema, insertVoteSchema } from "@shared/schema";

declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
    }
  }
}

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

      // Check if Pinata credentials are available
      const hasPinataCredentials = process.env.PINATA_API_KEY && 
                                    process.env.PINATA_API_KEY.length > 20 &&
                                    process.env.PINATA_SECRET_API_KEY;

      let ipfsHash: string;
      let metadataUri: string;

      if (hasPinataCredentials) {
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

        try {
          const pinataResponse = await axios.post(
            'https://api.pinata.cloud/pinning/pinFileToIPFS',
            formData,
            {
              headers: {
                ...formData.getHeaders(),
                'pinata_api_key': process.env.PINATA_API_KEY,
                'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY,
              },
            }
          );

          ipfsHash = pinataResponse.data.IpfsHash;

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
                'pinata_api_key': process.env.PINATA_API_KEY,
                'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY,
              },
            }
          );

          metadataUri = `ipfs://${metadataResponse.data.IpfsHash}`;
        } catch (pinataError: any) {
          console.warn("Pinata upload failed, using local storage:", pinataError.response?.status);
          // Fallback to local storage
          ipfsHash = `local-${Date.now()}-${Math.random().toString(36).substring(7)}`;
          metadataUri = `local-metadata-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        }
      } else {
        // Use local storage for development when Pinata is not configured
        console.log("Pinata credentials not configured, using local storage for images");
        ipfsHash = `local-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        metadataUri = `local-metadata-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      }

      // Save to storage (in production, this would be after blockchain minting)
      const tokenId = `token-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      
      // Store the image file data for local serving
      const imageData = req.file.buffer.toString('base64');
      const imageMimeType = req.file.mimetype;
      const imageDataURI = `data:${imageMimeType};base64,${imageData}`;
      
      const artwork = await storage.createArtwork({
        tokenId,
        title,
        description,
        artistAddress,
        artistName: undefined,
        ipfsHash,
        metadataUri,
        imageData: imageDataURI,
        contractAddress: undefined,
        price: price || undefined,
        royaltyPercentage: royaltyPercentage || "5",
      });

      // Also store image data for direct API access
      (storage as any).imageFiles = (storage as any).imageFiles || new Map();
      (storage as any).imageFiles.set(ipfsHash, {
        data: imageData,
        mimeType: imageMimeType,
        filename: req.file.originalname,
      });

      res.json({
        success: true,
        artwork,
        ipfsHash,
        metadataUri,
        message: "Artwork uploaded successfully. Ready to mint NFT!",
      });
    } catch (error: any) {
      console.error("Upload error:", error.response?.data || error.message || error);
      res.status(500).json({ 
        error: error.response?.data?.error || error.message || "Failed to upload artwork",
        details: error.response?.data
      });
    }
  });

  // Image serving endpoint for local development
  app.get("/api/images/:hash", async (req, res) => {
    try {
      const { hash } = req.params;
      const imageStore = (storage as any).imageFiles || new Map();
      
      if (!imageStore.has(hash)) {
        return res.status(404).json({ error: "Image not found" });
      }

      const imageData = imageStore.get(hash);
      const buffer = Buffer.from(imageData.data, 'base64');
      
      res.set('Content-Type', imageData.mimeType);
      res.set('Cache-Control', 'public, max-age=31536000');
      res.send(buffer);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Artwork Purchase route
  app.post("/api/artworks/purchase", async (req, res) => {
    try {
      const { artworkId, buyerAddress, artistAddress, price, transactionHash } = req.body;

      if (!artworkId || !buyerAddress || !artistAddress || !price || !transactionHash) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Record the purchase (in a real app, this would be stored in the database)
      const purchase = {
        artworkId,
        buyerAddress,
        artistAddress,
        price,
        transactionHash,
        purchasedAt: new Date(),
      };

      // Store purchase in memory (in production, save to database)
      (storage as any).purchases = (storage as any).purchases || [];
      (storage as any).purchases.push(purchase);

      res.json({
        success: true,
        purchase,
        message: "Purchase recorded successfully",
      });
    } catch (error: any) {
      console.error("Purchase recording error:", error);
      res.status(500).json({ error: error.message || "Failed to record purchase" });
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

  // Check if visitor has valid gallery ticket
  app.get("/api/tickets/check/:visitorAddress", async (req, res) => {
    try {
      const { visitorAddress } = req.params;

      if (!visitorAddress) {
        return res.status(400).json({ error: "Visitor address required" });
      }

      const hasTicket = await storage.hasValidTicket(visitorAddress);
      const tickets = await storage.getTicketsByVisitor(visitorAddress);

      res.json({
        hasValidTicket: hasTicket,
        ticketCount: tickets.length,
        tickets: tickets,
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

  // 404 handler for unmapped API routes
  app.get("/api/*", (_req, res) => {
    res.status(404).json({ error: "API endpoint not found" });
  });

  app.post("/api/*", (_req, res) => {
    res.status(404).json({ error: "API endpoint not found" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
