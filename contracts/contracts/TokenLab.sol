// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TokenLab
 * @dev implementation of a customizable ERC20 token with tax and limit mechanics.
 * Built for the TokenLab platform. Follows OpenZeppelin v5.x standards.
 */
contract TokenLab is ERC20, ERC20Burnable, Ownable {
    /**
     * @dev Struct to hold tax settings for different events (buy/sell).
     * @param totalTax Total tax in basis points (e.g., 500 = 5%).
     * @param liquidityPercent % of the collected tax sent to liquidity.
     * @param burnPercent % of the collected tax to be burned.
     * @param walletPercent % of the collected tax sent to a specific project wallet.
     * @param walletTarget The address receiving the walletPercent share.
     */
    struct TaxConfig {
        uint16 totalTax; // in basis points (100 = 1%)
        uint16 liquidityPercent; // percentage of totalTax
        uint16 burnPercent; // percentage of totalTax
        uint16 walletPercent; // percentage of totalTax
        address walletTarget;
    }

    // Tax configurations for Buy and Sell events (usually triggered via Dex pairs)
    TaxConfig public buyTax;
    TaxConfig public sellTax;

    // Anti-whale limits (e.g., max 2% of total supply per wallet)
    uint256 public maxWalletAmount;
    uint256 public maxTxAmount;

    // State mappings to manage fee/limit exemptions and identify DEX pairs
    mapping(address => bool) public isExcludedFromFees;
    mapping(address => bool) public isExcludedFromLimits;
    mapping(address => bool) public isAutomatedMarketMakerPair;

    // Trading is disabled by default to allow owner to set up initial liquidity/taxes
    bool public tradingEnabled = false;

    event TradingEnabled();
    event SetAutomatedMarketMakerPair(address indexed pair, bool indexed value);
    event ExcludeFromFees(address indexed account, bool isExcluded);
    event ExcludeFromLimits(address indexed account, bool isExcluded);
    event UpdateTax(string taxType, uint256 totalTax);
    event UpdateLimits(uint256 maxWalletAmount, uint256 maxTxAmount);

    /**
     * @dev Constructor is called once during token deployment.
     * @param name Name of the token (e.g., "MyToken").
     * @param symbol Symbol of the token (e.g., "MTK").
     * @param totalSupply_ Total amount of tokens to create (in absolute units including decimals).
     * @param initialOwner Address that will have permission to configure taxes/limits.
     * @param distributionWallets List of addresses to receive the initial supply.
     * @param distributionPercents Corresponding percentages for each wallet (must sum to 100).
     */
    constructor(
        string memory name,
        string memory symbol,
        uint256 totalSupply_,
        address initialOwner,
        address[] memory distributionWallets,
        uint256[] memory distributionPercents
    ) ERC20(name, symbol) Ownable(initialOwner) {
        require(
            distributionWallets.length == distributionPercents.length,
            "TokenLab: distribution mismatch"
        );

        uint256 totalPercent = 0;
        for (uint256 i = 0; i < distributionWallets.length; i++) {
            uint256 amount = (totalSupply_ * distributionPercents[i]) / 100;
            _mint(distributionWallets[i], amount);
            totalPercent += distributionPercents[i];
        }
        require(
            totalPercent == 100,
            "TokenLab: total distribution must be 100%"
        );

        isExcludedFromFees[initialOwner] = true;
        isExcludedFromFees[address(this)] = true;

        isExcludedFromLimits[initialOwner] = true;
        isExcludedFromLimits[address(this)] = true;
        isExcludedFromLimits[address(0)] = true;

        // Initial limits based on common defaults (can be adjusted by owner)
        maxWalletAmount = (totalSupply_ * 2) / 100; // 2%
        maxTxAmount = (totalSupply_ * 1) / 100; // 1%
    }

    function enableTrading() external onlyOwner {
        require(!tradingEnabled, "TokenLab: Trading already enabled");
        tradingEnabled = true;
        emit TradingEnabled();
    }

    function setAutomatedMarketMakerPair(
        address pair,
        bool value
    ) external onlyOwner {
        isAutomatedMarketMakerPair[pair] = value;
        emit SetAutomatedMarketMakerPair(pair, value);
    }

    function excludeFromFees(
        address account,
        bool excluded
    ) external onlyOwner {
        isExcludedFromFees[account] = excluded;
        emit ExcludeFromFees(account, excluded);
    }

    function excludeFromLimits(
        address account,
        bool excluded
    ) external onlyOwner {
        isExcludedFromLimits[account] = excluded;
        emit ExcludeFromLimits(account, excluded);
    }

    /**
     * @dev Sets the Buy Tax configuration. Usually called right after deployment.
     * @param totalTax Total tax in basis points (max 2500 i.e. 25%).
     * @param liquidityPercent Share of tax for LP.
     * @param burnPercent Share of tax to burn.
     * @param walletPercent Share of tax for project wallet.
     * @param walletTarget Destination address for project wallet share.
     */
    function configureBuyTax(
        uint16 totalTax,
        uint16 liquidityPercent,
        uint16 burnPercent,
        uint16 walletPercent,
        address walletTarget
    ) external onlyOwner {
        require(totalTax <= 2500, "TokenLab: Tax > 25%");
        require(
            liquidityPercent + burnPercent + walletPercent == 100,
            "TokenLab: Percent sum must be 100"
        );
        buyTax = TaxConfig(
            totalTax,
            liquidityPercent,
            burnPercent,
            walletPercent,
            walletTarget
        );
        emit UpdateTax("buy", totalTax);
    }

    function configureSellTax(
        uint16 totalTax,
        uint16 liquidityPercent,
        uint16 burnPercent,
        uint16 walletPercent,
        address walletTarget
    ) external onlyOwner {
        require(totalTax <= 2500, "TokenLab: Tax > 25%");
        require(
            liquidityPercent + burnPercent + walletPercent == 100,
            "TokenLab: Percent sum must be 100"
        );
        sellTax = TaxConfig(
            totalTax,
            liquidityPercent,
            burnPercent,
            walletPercent,
            walletTarget
        );
        emit UpdateTax("sell", totalTax);
    }

    function setLimits(
        uint256 _maxWalletAmount,
        uint256 _maxTxAmount
    ) external onlyOwner {
        maxWalletAmount = _maxWalletAmount;
        maxTxAmount = _maxTxAmount;
        emit UpdateLimits(_maxWalletAmount, _maxTxAmount);
    }

    /**
     * @dev Implementation of tax and limit logic during transfers.
     */
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        // Minting/Burning bypass checks
        if (from == address(0) || to == address(0)) {
            super._update(from, to, amount);
            return;
        }

        // Trading status check
        if (
            !tradingEnabled &&
            !isExcludedFromFees[from] &&
            !isExcludedFromFees[to]
        ) {
            revert("TokenLab: Trading not enabled");
        }

        // Limit checks
        if (!isExcludedFromLimits[from] && !isExcludedFromLimits[to]) {
            require(amount <= maxTxAmount, "TokenLab: Tx limit");
            if (!isAutomatedMarketMakerPair[to]) {
                require(
                    balanceOf(to) + amount <= maxWalletAmount,
                    "TokenLab: Wallet limit"
                );
            }
        }

        uint256 fees = 0;
        // Tax logic
        if (!isExcludedFromFees[from] && !isExcludedFromFees[to]) {
            TaxConfig memory config;
            bool applyTax = false;

            if (isAutomatedMarketMakerPair[from]) {
                config = buyTax;
                applyTax = true;
            } else if (isAutomatedMarketMakerPair[to]) {
                config = sellTax;
                applyTax = true;
            }

            if (applyTax && config.totalTax > 0) {
                fees = (amount * config.totalTax) / 10000;

                if (fees > 0) {
                    uint256 burnPart = (fees * config.burnPercent) / 100;
                    uint256 walletPart = (fees * config.walletPercent) / 100;
                    uint256 liquidityPart = fees - burnPart - walletPart;

                    if (burnPart > 0) {
                        super._update(from, address(0), burnPart);
                    }
                    if (walletPart > 0 && config.walletTarget != address(0)) {
                        super._update(from, config.walletTarget, walletPart);
                    }
                    if (liquidityPart > 0) {
                        super._update(from, address(this), liquidityPart);
                    }
                }
            }
        }

        super._update(from, to, amount - fees);
    }
}
