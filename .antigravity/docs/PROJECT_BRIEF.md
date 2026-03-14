# TokenLab | Deploy Advanced Tokens Effortlessly

**TokenLab** is a revolutionary visual tokenomics builder platform based on **Blockly**. It enables users (both developers and non-coders) to design, simulate, and deploy advanced ERC-20 smart contracts with complex tokenomics mechanics through an intuitive "drag-and-drop" visual interface.

## Project Vision
To provide a one-stop solution for secure, professional, and transparent token launches. TokenLab removes technical barriers for non-coder innovators while giving Web3 developers advanced tools to precisely manage their token economy.

## Key Features

### 1. Visual Tokenomics Builder (Blockly)
TokenLab's core infrastructure uses a customized **Google Blockly** engine for blockchain logic.
- **Visual Programming**: Replaces manual Solidity coding with intuitive puzzle blocks.
- **Logic Validation**: Ensures block structures always follow the `Event -> Tax -> Split -> Action` hierarchy.
- **Real-time Configuration**: Generates structured JSON configurations consumed directly by the deployment hooks.

### 2. Advanced Tax Mechanics (Smart Contract Level)
The implementation in `TokenLab.sol` allow for highly flexible tax settings:
- **Basis Points System**: Taxes are calculated using a basis points system (1% = 100) for high precision.
- **Buy & Sell Differentiation**: A unique mechanism that detects trades via Uniswap Pair addresses to apply different taxes for buys and sells.
- **Sequential Distribution**: Collected taxes are distributed atomically to **Auto-Liquidity** (contract), **Burn Address** (deflation), and **Project Wallets** (marketing/team) in a single transaction sequence.

### 3. Anti-Whale & Safety (Limits)
Built-in security features to prevent market manipulation:
- **Max Wallet Amount**: Limits supply concentration in a single address (default 2% of total supply).
- **Max Transaction Amount**: Prevents large "dumps" in a single swap (default 1% of total supply).
- **Trading Toggle**: Contracts start with `tradingEnabled = false` to allow the owner to set up initial liquidity and taxes before public trading begins.

### 4. Professional Reporting & Transparency
- **Live Analytics**: A preview panel using **Recharts** displays real-time visual tax allocations.
- **Tokenomics Report**: Document-grade printable reports including initial distribution details, tax mechanics, and the TokenLab verification stamp.

### 5. Post-Launch Educational System
The **"Understanding Mechanics"** modal provides interactive documentation explaining technical concepts such as:
- **Pair Registration**: How to register Uniswap pool addresses into the contract so the tax system can detect swaps.
- **Etherscan Interaction**: Step-by-step tutorials on calling contract functions via block explorers.

---

## Core Visual Blocks List

| Category | Block Name | Color | Function |
| :--- | :--- | :--- | :--- |
| **Event** | WHEN BUY | Blue | Detects transfers from a DEX Pair to a User. |
| **Event** | WHEN SELL | Blue | Detects transfers from a User to a DEX Pair. |
| **Tax** | TAX % | Orange | Defines the total tax basis (Max 25%). |
| **Structure** | SPLIT | Yellow | Distribution point for splitting tax allocations. |
| **Action** | LIQUIDITY % | Green | Locks a portion of the tax into the contract as liquidity reserves. |
| **Action** | SEND WALLET %| Purple | Automatically sends tax allocations to marketing/treasury wallets. |
| **Action** | BURN % | Red | Sends tax allocations to the zero address (0x0...0) for deflationary effects. |
| **Limits** | MAX WALLET % | Gray | Percentage-based wallet ownership limits. |
| **Limits** | MAX TX % | Gray | Percentage-based per-transaction limits. |

---

## Technical Use Cases

### Case A: Deflationary Meme Coin
- **Setup**: `WHEN BUY` / `WHEN SELL` -> `TAX 5%` -> `SPLIT` -> `BURN 100%`.
- **Use Case**: Aggressively creates token scarcity to attract speculative investors through a transparent deflationary system.

### Case B: Venture Capital Style (No Tax, High Security)
- **Setup**: 0% tax on all events, but enabled `MAX WALLET 1%` and `MAX TX 0.5%`.
- **Use Case**: Ensures broad token distribution and prevents price manipulation by "whales," ideal for utility tokens focused on decentralization.

### Case C: Sustained Ecosystem Growth
- **Setup**: `WHEN SELL 10%` -> `SPLIT` -> `LIQUIDITY 50%`, `WALLET 30%`, `BURN 20%`.
- **Use Case**: Ensures long-term liquidity growth while automatically funding team marketing operations from trading volume.

---

## Deployment & Launch Lifecycle
1. **Design**: Compose visual blocks and define token identity parameters.
2. **Analysis**: Verify the economic model via the analytics panel and print the official report.
3. **Deployment**:
    - Transaction 1: `TokenFactory` deploys a `TokenLab` instance.
    - Transaction 2 & 3: Configure Buy & Sell taxes.
    - Transaction 4: Set Anti-Whale limits.
    - Transaction 5: Activate trading status (`enableTrading`).
4. **Liquidity**: The owner adds liquidity on a DEX (e.g., Uniswap).
5. **Registration**: The owner registers the Pair address via the `setAutomatedMarketMakerPair` function to activate automatic taxes.

**TokenLab - Deploy Advanced Tokens Effortlessly**
