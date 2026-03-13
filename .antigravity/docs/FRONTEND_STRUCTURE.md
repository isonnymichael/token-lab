# TokenLab Frontend Structure

This document outlines the architecture, component hierarchy, and design patterns used in the TokenLab MVP frontend.

## Tech Stack
- **Framework:** React 18 + Vite + TypeScript
- **Styling:** TailwindCSS
- **State Management:** React Context API (`AppContext`)
- **Visual Builder:** Google Blockly (`blockly/core`)
- **Analytics/Charts:** Recharts
- **Icons:** Lucide React

## Folder Structure
```text
frontend/
├── src/
│   ├── blocks/              # Core logic for the Visual Builder
│   │   ├── generator.ts     # Converts Blockly Workspace into JSON configs
│   │   ├── templates.ts     # Pre-configured XML workspace templates
│   │   ├── tokenBlocks.ts   # Custom SVG Block definitions (Tax, Split, Burn, etc.)
│   │   └── validation.ts    # Real-time logic enforcement & error handling
│   │
│   ├── components/          # UI Components
│   │   ├── Layout.tsx       # Main Grid Container
│   │   ├── TopBar.tsx       # Token Info & Deploy actions
│   │   ├── LeftPanel.tsx    # Toolbox reference
│   │   ├── RightPanel.tsx   # Live Analytics & Flow Diagram
│   │   ├── BlocklyWorkspace.tsx # The Drag-and-Drop canvas
│   │   └── TemplateModal.tsx    # Onboarding template selector
│   │
│   ├── context/             # Global State
│   │   └── AppContext.tsx   # Holds valid JSON config and Token Metadata
│   │
│   ├── App.tsx              # Root Component
│   ├── index.css            # Global Styles & Tailwind Imports
│   └── main.tsx             # Entry Point
```

## State Management Flow
The application relies heavily on a unidirectional data flow powered by Context and the Blockly Event Bus:

1. **User Interaction**: User connects, drags, or modifies blocks inside `BlocklyWorkspace.tsx`.
2. **Event Listener**: The workspace fires a `workspaceChange` event.
3. **Validation (`validation.ts`)**: Checks if blocks are orphaned or if limits exceed maximums. Drops an error flag if invalid.
4. **Generation (`generator.ts`)**: If valid, traverses the blocks and generates a consolidated JSON string representing the tokenomics (e.g., \`{ buy: { tax: 10 }, maxWallet: 2 }\`).
5. **Context Update (`AppContext.tsx`)**: The JSON string is parsed and saved into the global React Context.
6. **Reactivity**: `RightPanel.tsx` naturally re-renders, feeding the Context JSON into the `Recharts` Pie Chart and the static CSS Flow Diagram.

## Project Standards & Modularity
- **Component Isolation:** Each UI panel acts independently. `RightPanel` should not know *how* `BlocklyWorkspace` generates data, it only listens to the shared `AppContext`.
- **Pure Functions:** Blockly generation and validation are kept as pure functions in the `src/blocks` folder to keep React components clean.
- **Future Modularity:** 
  - The `RightPanel` is currently monolithic. As analytics grow, it should be split into smaller components (`PieChartWidget.tsx`, `FlowDiagramWidget.tsx`, `StatsWidget.tsx`).
  - The `generator.ts` currently translates blocks to JSON. A new generator will be created to translate JSON to Solidity (or directly Blockly to Solidity).
