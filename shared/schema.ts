import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, numeric, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles for the dApp
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull().unique(),
  role: text("role").notNull(), // 'artist' | 'visitor'
  isDaoMember: boolean("is_dao_member").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// NFT Artworks minted by artists
export const artworks = pgTable("artworks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tokenId: text("token_id").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  artistAddress: text("artist_address").notNull(),
  artistName: text("artist_name"),
  ipfsHash: text("ipfs_hash").notNull(), // IPFS CID for the artwork image
  metadataUri: text("metadata_uri").notNull(), // Full IPFS URI for metadata
  contractAddress: text("contract_address"),
  price: numeric("price"),
  royaltyPercentage: numeric("royalty_percentage").default("5"),
  mintedAt: timestamp("minted_at").notNull().defaultNow(),
});

// Museum tickets purchased by visitors
export const tickets = pgTable("tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  visitorAddress: text("visitor_address").notNull(),
  ticketType: text("ticket_type").notNull(), // 'general' | 'premium' | 'vip'
  price: numeric("price").notNull(),
  purchasedAt: timestamp("purchased_at").notNull().defaultNow(),
  transactionHash: text("transaction_hash"),
});

// DAO Proposals for exhibits and events
export const proposals = pgTable("proposals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  proposalId: text("proposal_id").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  proposerAddress: text("proposer_address").notNull(),
  proposalType: text("proposal_type").notNull(), // 'exhibit' | 'event' | 'governance'
  votesFor: integer("votes_for").notNull().default(0),
  votesAgainst: integer("votes_against").notNull().default(0),
  votesAbstain: integer("votes_abstain").notNull().default(0),
  status: text("status").notNull().default("active"), // 'active' | 'passed' | 'rejected' | 'executed'
  startTime: timestamp("start_time").notNull().defaultNow(),
  endTime: timestamp("end_time").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// User votes on proposals
export const votes = pgTable("votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  proposalId: text("proposal_id").notNull(),
  voterAddress: text("voter_address").notNull(),
  voteType: text("vote_type").notNull(), // 'for' | 'against' | 'abstain'
  votingPower: numeric("voting_power").notNull(),
  votedAt: timestamp("voted_at").notNull().defaultNow(),
});

// Zod schemas for inserts
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertArtworkSchema = createInsertSchema(artworks).omit({
  id: true,
  mintedAt: true,
});

export const insertTicketSchema = createInsertSchema(tickets).omit({
  id: true,
  purchasedAt: true,
});

export const insertProposalSchema = createInsertSchema(proposals).omit({
  id: true,
  createdAt: true,
  votesFor: true,
  votesAgainst: true,
  votesAbstain: true,
  status: true,
});

export const insertVoteSchema = createInsertSchema(votes).omit({
  id: true,
  votedAt: true,
});

// TypeScript types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertArtwork = z.infer<typeof insertArtworkSchema>;
export type Artwork = typeof artworks.$inferSelect;

export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type Ticket = typeof tickets.$inferSelect;

export type InsertProposal = z.infer<typeof insertProposalSchema>;
export type Proposal = typeof proposals.$inferSelect;

export type InsertVote = z.infer<typeof insertVoteSchema>;
export type Vote = typeof votes.$inferSelect;
