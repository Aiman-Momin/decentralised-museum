// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title MuseumNFT
 * @dev ERC-721 NFT contract for Decentralized Museum artworks with royalty tracking
 */
contract MuseumNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Mapping from token ID to royalty percentage (in basis points, e.g., 500 = 5%)
    mapping(uint256 => uint256) public royalties;
    
    // Mapping from token ID to artist address
    mapping(uint256 => address) public artists;
    
    // Mapping from token ID to artwork price
    mapping(uint256 => uint256) public artworkPrices;

    event ArtworkMinted(
        uint256 indexed tokenId,
        address indexed artist,
        string tokenURI,
        uint256 royaltyPercentage,
        uint256 price
    );

    constructor() ERC721("Decentralized Museum Art", "DMART") Ownable(msg.sender) {}

    /**
     * @dev Mint a new artwork NFT
     * @param artist Address of the artist
     * @param tokenURI IPFS URI for the artwork metadata
     * @param royaltyPercentage Royalty percentage in basis points (e.g., 500 = 5%)
     * @param price Initial price of the artwork in wei
     */
    function mintArtwork(
        address artist,
        string memory tokenURI,
        uint256 royaltyPercentage,
        uint256 price
    ) public returns (uint256) {
        require(royaltyPercentage <= 1000, "Royalty cannot exceed 10%");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(artist, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        artists[newTokenId] = artist;
        royalties[newTokenId] = royaltyPercentage;
        artworkPrices[newTokenId] = price;

        emit ArtworkMinted(newTokenId, artist, tokenURI, royaltyPercentage, price);

        return newTokenId;
    }

    /**
     * @dev Get the royalty information for a token
     * @param tokenId The NFT token ID
     * @return artist The original artist address
     * @return royaltyAmount The royalty amount in basis points
     */
    function getRoyaltyInfo(uint256 tokenId) 
        public 
        view 
        returns (address artist, uint256 royaltyAmount) 
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return (artists[tokenId], royalties[tokenId]);
    }

    /**
     * @dev Get the current token counter
     */
    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIds.current();
    }

    // Override required functions
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
