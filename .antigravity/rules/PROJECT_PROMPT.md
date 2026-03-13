# TokenLab — Project Implementation Prompts (Refined MVP)

## AI System Role & Instructions
> **System Prompt:** "You are an expert Senior Full-Stack Web3 Developer with deep mastery in Solidity, React, and Blockly. Your mission is to build TokenLab, a premium no-code tokenomics platform. You prioritize security (OpenZeppelin standards), performance (gas optimization), and exceptional UX (Scratch-inspired aesthetics). When asked to implement steps, provide production-ready code, follow strict hierarchy rules, and ensure seamless integration between the visual builder and the blockchain layer."

This guide contains step-by-step prompts to build TokenLab using **Blockly** with a **Scratch theme**.
 10-block architecture and mandatory hierarchy.

---

## Phase 1: Workspace & Custom Logic

### Prompt 1: Final Interface Layout
> "Create a React dashboard with a fixed 3-column layout using TailwindCSS. 
> - **Left**: 'Blocks' panel with a searchable list of 10 blocks.
> - **Center**: 'Workspace' powered by Blockly (Scratch theme).
> - **Right**: 'Preview' panel with a vertical stack of Pie Chart (Recharts), Flow Diagram (SVG), and 'Token Stats' table.
> Implement the Top Bar with inputs for Name, Symbol, Supply, Network, and a 'Deploy' button."

### Prompt 2: The 10-Block Definition
> "Inside Blockly, define the following 10 blocks with specific colors and shapes:
> 1. **Events (Blue)**: `when_buy`, `when_sell`, `when_transfer`.
> 2. **Tax (Orange)**: `tax_container` (accepts inner blocks).
> 3. **Structure (Yellow)**: `split_logic` (must be nested in a tax block).
> 4. **Distribution (Green/Red/Purple)**: `liquidity_block`, `burn_block`, `wallet_block` (must be nested in split).
> 5. **Limits (Gray)**: `max_wallet_limit`, `max_tx_limit`.
> Implement 'Statement' connections (puzzle notches) to enforce the hierarchy: EVENT -> TAX -> SPLIT -> DISTRIBUTION."

---

## Phase 2: Logic Enforcement & Validation

### Prompt 3: Strict Hierarchy Validation
> "Implement real-time block validation. If a user tries to connect a `burn_block` directly to a `when_buy` block (skipping `tax` and `split`), highlight the blocks in red and show a warning tooltip: 'Distribution blocks must be inside a SPLIT block within a TAX container'. Disable the 'Deploy' button until the workspace logic is valid."

### Prompt 4: Real-time Config Generator
> "Create a custom Blockly generator that parses the workspace into a structured JSON config.
> Example Output:
> ```json
> {
>   'buy': { 'tax': 10, 'split': { 'liq': 4, 'burn': 3, 'mkt': 3 } },
>   'sell': { 'tax': 5, 'split': { 'liq': 2, 'burn': 3 } }
> }
> ```
> This generator should run on every `workspaceChange` event."

---

## Phase 3: Visual Intelligence (Preview Panel)

### Prompt 5: Dynamic Pie Chart & Flow
> "Bind the JSON config to the Right Panel. Implement a `recharts` Pie Chart that shows total tax breakdown. Create a 'Flow Diagram' using simple SVG elements that visualizes the 'Transaction path'. If `WHEN BUY` is selected, show: `BUY -> 10% TAX -> (4% Liq, 3% Mkt, 3% Burn)`."

### Prompt 6: Live Token Stats
> "Implement a 'Token Stats' component in the preview panel. Calculate and display:
> - Initial Supply (from Top Bar)
> - Total Tax (%) per transaction type
> - Estimated Burn impact per 1M tokens
> Ensure numbers update as user edits block inputs."

---

## Phase 4: Smart Contract & Blockchain Deployment

### Prompt 7: Production-Ready Token Contract
> "Write a Solidity contract using OpenZeppelin ERC20. Create a `_transfer` override that checks `from` and `to` against known Dex Pairs (to identify buy/sell). Use the JSON configuration to apply tax and distribution logic. Add a `swapAndLiquify` mechanic for the Liquidity portion. Ensure the contract is optimized for gas efficiency."

### Prompt 8: Advanced Deployment UI
> "Build the 'Deployment Dashboard'. When 'Deploy' is clicked, show a checklist: 
> 1. Validating Logic [Done] 
> 2. Estimating Gas [In Progress] 
> 3. Wallet Confirmation [Waiting]. 
> On successful deployment, store the contract address and provide a 'Copy Address' and 'View on Scan' button."
