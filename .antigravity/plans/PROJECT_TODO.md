# TokenLab Project TODO

This document tracks the remaining tasks and future phases required to complete the TokenLab MVP.

## Current Status
- [x] **Phase 1: Workspace & Custom Logic** 
  - UI Layout, Context Setup, Blockly Integration, and 10 custom blocks definitions.
- [x] **Phase 2: Logic Enforcement & Validation** 
  - Real-time hierarchy/math validation, dynamic JSON generation, Workspace templating.
- [x] **Phase 3: Visual Intelligence** 
  - Live Recharts Pie Chart, CSS flow diagrams, Token Stats.

## Remaining Phases

### Phase 4: Smart Contract & Blockchain Deployment
- [ ] **Solidity Template Generation:**
  - Create a backend service or client-side generator to map the JSON `TokenConfig` into an OpenZeppelin ERC20 smart contract.
  - Inject the `tax`, `split`, `liquidity_block`, `wallet_block`, `burn_block` logic into an overridden `_transfer` function.
  - Inject `maxWallet` and `maxTx` limits.
- [ ] **Deployment UI:**
  - Build the "Deployment Dashboard" modal that appears when "Deploy" is clicked on the Top Bar.
  - Integrate Web3 Wallet connection using **Wagmi** and **Web3Modal** for seamless connection to Ethereum/EVM chains.
  - Implement a deployment checklist: (1) Validating Logic, (2) Estimating Gas, (3) Wallet Confirmation.
  - Display the final deployed contract address with "Copy" and "View on Explorer" buttons.

### Phase 5: Backend & Storage (Optional/Future)
- [ ] Implement user authentication / SIWE (Sign-In with Ethereum).
- [ ] Create a Database to save user tokenomics templates securely.
- [ ] Allow users to fetch and load previous workspaces.

### Frontend Optimization Tasks (Ongoing)
- [ ] **Component Split:** Refactor `RightPanel.tsx` into smaller sub-components (`/components/analytics/PieChartWidget.tsx`, etc.).
- [ ] **Blockly Extension:** Add advanced blocks (e.g., "Exclude From Fee", "Whitelist").
- [ ] **Responsiveness:** Optimize the Top Bar and Panels for smaller screens (currently fixed to 100vh desktop layout).
