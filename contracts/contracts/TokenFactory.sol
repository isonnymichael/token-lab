// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./TokenLab.sol";

/**
 * @title TokenFactory
 * @dev Factory contract to deploy and track TokenLab instances.
 */
contract TokenFactory {
    // Array to track all tokens created through this factory
    address[] public allTokens;
    
    // Mapping from owner to their tokens
    mapping(address => address[]) public userTokens;

    event TokenCreated(
        address indexed tokenAddress,
        string name,
        string symbol,
        address indexed creator
    );

    /**
     * @dev Deploys a new TokenLab instance.
     * @return tokenAddress The address of the newly deployed token.
     */
    function createToken(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        address[] memory distributionWallets,
        uint256[] memory distributionPercents
    ) external returns (address tokenAddress) {
        // Deploy new contract. msg.sender becomes the initial owner.
        TokenLab newToken = new TokenLab(
            name,
            symbol,
            totalSupply,
            msg.sender,
            distributionWallets,
            distributionPercents
        );
        
        tokenAddress = address(newToken);
        
        // Track the token
        allTokens.push(tokenAddress);
        userTokens[msg.sender].push(tokenAddress);

        emit TokenCreated(tokenAddress, name, symbol, msg.sender);
    }

    /**
     * @dev Returns total number of tokens created.
     */
    function getTokenCount() external view returns (uint256) {
        return allTokens.length;
    }

    /**
     * @dev Returns all tokens for a specific user.
     */
    function getUserTokens(address user) external view returns (address[] memory) {
        return userTokens[user];
    }
}
