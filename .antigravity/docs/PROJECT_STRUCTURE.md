# TokenLab Project Structure

This document describes the technical architecture, component hierarchy, and design patterns underlying the TokenLab platform.

## Tech Stack
-   **Frontend**: React 18 + Vite + TypeScript.
-   **Styling**: Hybrid system using TailwindCSS for the dashboard interface and Vanilla CSS for the printable report module.
-   **State Management**: `AppContext` (React Context) manages synchronization between the Blockly Workspace and the analytics preview.
-   **Web3 Orchestration**: 
    -   **Wagmi & Viem**: For account management, RPC interactions, and low-level contract calls.
    -   **RainbowKit**: Modern wallet integration with multi-chain support (Focused on Sepolia).
-   **Visual Builder**: **Google Blockly** with a custom generator to produce structured JSON configurations.
-   **Analytics**: **Recharts** for tokenomics data visualization.

## Folder Structure (Final Edition)

```text
frontend/
├── public/                  # Static assets: flat-logo, favicon, manifest.
├── src/
│   ├── blocks/              # Visual Builder Core Engine
│   │   ├── generator.ts     # Logic for translating Blockly block trees into JSON data models.
│   │   ├── templates.ts     # XML template library (Standard, Deflationary, Whale-proof).
│   │   ├── tokenBlocks.ts   # Visual block definitions (SVG, colors, connections, tooltips).
│   │   └── validation.ts    # Integrity filters to prevent block structures that would break the contract.
│   │
│   ├── components/          # UI Layer
│   │   ├── analytics/       # Visualization & Reporting Modules
│   │   │   ├── TokenomicsPieChartWidget.tsx  # Tax distribution chart widget.
│   │   │   └── TokenomicsReport.tsx          # Specialized component for document/PDF rendering.
│   │   ├── Layout.tsx       # Main grid architecture of the application.
│   │   ├── TopBar.tsx       # Navigation, token metadata, & deployment orchestration.
│   │   ├── RightPanel.tsx   # Control center for preview, stats, and educational modules.
│   │   ├── Workspace.tsx    # Blockly canvas integration with React lifecycle.
│   │   ├── TemplateModal.tsx# Onboarding template selection interface.
│   │   └── MechanicsInfoModal.tsx # Post-launch technical education module.
│   │
│   ├── context/             # Global State Management
│   │   └── AppContext.tsx   # Single source of truth for tokenomics config & deployment metadata.
│   │
│   ├── hooks/               # Business Logic & Blockchain Interaction
│   │   └── useDeployToken.ts # Managed multi-stage deployment (Factory -> Token -> Config).
│   │
│   ├── styles/              # Aesthetic Assets
│   │   └── TokenomicsReport.css # @print media query definitions for professional reports.
│   │
│   ├── App.tsx              # Root wrapper for providers (Wagmi, Theme, Context).
│   └── main.tsx             # RPC configuration and application initialization.
```

## Application Architecture & Data Flow

TokenLab utilizes a **Unidirectional Data Flow** pattern to synchronize the visual builder and the preview UI:

1.  **Blockly Logic**: When a user manipulates blocks, `Workspace.tsx` detects the change and calls the custom generator in `generator.ts`.
2.  **JSON Transformation**: The generator produces a JSON object representing the tax structure and limits.
3.  **Global Context Update**: The JSON object is sent to `AppContext`. Final validation ensures that tax distribution total always sums to 100%.
4.  **Reactive Visualization**:
    -   The `PieChart` widget automatically re-renders tax proportions based on the latest state.
    -   The `Token Identity` panel updates metadata such as symbol and name instantly.
5.  **Multi-Step Deployment (Hook Logic)**:
    -   `useDeployToken` manages the complex sequence of blockchain transactions.
    -   Stages: `TokenFactory.createToken()` -> Wait for Receipt -> Extract Token Address from Event Logs -> Execute configuration functions (`configureBuyTax`, `configureSellTax`, `setLimits`) -> Finally, call `enableTrading()`.

## Smart Contract Ecosystem

-   **TokenFactory.sol**: Functions as a registry manager. Every token deployed through this factory is recorded on-chain, facilitating future token tracking for users.
-   **TokenLab.sol**: The core of token functionality. 
    -   **Security**: Uses audited OpenZeppelin v5.x standards.
    -   **Efficiency**: Calculates taxes only when transactions involve an `AutomatedMarketMakerPair`, minimizing gas costs for standard wallet-to-wallet transfers.
    -   **Flexibility**: Separating buy and sell tax configurations gives project managers full control over their market pricing strategies.

## Project Standards
-   **Modularity**: Blockly logic is strictly separated from the React framework, allowing the builder engine to be easily reused or updated.
-   **TypeScript Rigidity**: The entire data flow, from blocks to deployment, uses strict TypeScript interfaces to minimize runtime bugs.
-   **Premium UX**: Focus on aesthetic detail, from modal transitions to the visual quality of printed reports.

---
**TokenLab v1.0 - Robust Architecture for Decentralized Economy.**
