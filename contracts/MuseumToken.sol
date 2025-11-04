// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MuseumToken
 * @dev ERC-20 token for museum tickets and DAO governance
 */
contract MuseumToken is ERC20, Ownable {
    // Price for different ticket types in tokens
    uint256 public constant GENERAL_TICKET_PRICE = 10 * 10**18; // 10 tokens
    uint256 public constant PREMIUM_TICKET_PRICE = 20 * 10**18; // 20 tokens
    uint256 public constant VIP_TICKET_PRICE = 50 * 10**18; // 50 tokens
    
    // DAO membership price
    uint256 public constant DAO_MEMBERSHIP_PRICE = 100 * 10**18; // 100 tokens

    event TicketPurchased(address indexed buyer, string ticketType, uint256 amount);
    event DaoMembershipGranted(address indexed member, uint256 tokensReceived);

    constructor() ERC20("Museum Token", "MTKN") Ownable(msg.sender) {
        // Mint initial supply to contract owner (1 million tokens)
        _mint(msg.sender, 1000000 * 10**18);
    }

    /**
     * @dev Purchase museum tickets with tokens
     * @param ticketType Type of ticket: "general", "premium", or "vip"
     */
    function purchaseTicket(string memory ticketType) public {
        uint256 price;
        
        if (keccak256(bytes(ticketType)) == keccak256(bytes("general"))) {
            price = GENERAL_TICKET_PRICE;
        } else if (keccak256(bytes(ticketType)) == keccak256(bytes("premium"))) {
            price = PREMIUM_TICKET_PRICE;
        } else if (keccak256(bytes(ticketType)) == keccak256(bytes("vip"))) {
            price = VIP_TICKET_PRICE;
        } else {
            revert("Invalid ticket type");
        }

        require(balanceOf(msg.sender) >= price, "Insufficient token balance");
        
        _transfer(msg.sender, owner(), price);
        
        emit TicketPurchased(msg.sender, ticketType, price);
    }

    /**
     * @dev Join DAO and receive governance tokens
     */
    function joinDao() public {
        require(balanceOf(msg.sender) >= DAO_MEMBERSHIP_PRICE, "Insufficient tokens for DAO membership");
        
        // Burn membership fee
        _burn(msg.sender, DAO_MEMBERSHIP_PRICE);
        
        // Grant governance tokens (2x the membership price)
        _mint(msg.sender, DAO_MEMBERSHIP_PRICE * 2);
        
        emit DaoMembershipGranted(msg.sender, DAO_MEMBERSHIP_PRICE * 2);
    }

    /**
     * @dev Mint tokens (only owner)
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Distribute tokens to users for testing
     */
    function faucet() public {
        // Give 1000 tokens to anyone who calls this (for testing)
        _mint(msg.sender, 1000 * 10**18);
    }
}
