import * as Blockly from 'blockly/core';

// Create a custom code generator for our Token JSON config
export const TokenJSONGenerator = new Blockly.Generator('JSON');

TokenJSONGenerator.scrub_ = function(block: Blockly.Block, code: string, thisOnly?: boolean): string {
  const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  const nextCode = thisOnly ? '' : TokenJSONGenerator.blockToCode(nextBlock);
  
  const c = code.trim();
  const n = typeof nextCode === 'string' ? nextCode.trim() : '';
  
  if (c && n) {
    // If we have both, join them with a comma
    return c + ',\n' + n;
  }
  return c + n;
};

// 1. Events
TokenJSONGenerator.forBlock['when_buy'] = function(block: Blockly.Block) {
  const taxNodes = TokenJSONGenerator.statementToCode(block, 'TAX_CONTAINER') as string;
  if (!taxNodes) return '';
  return `"buy": {\n${taxNodes}\n  }`;
};

TokenJSONGenerator.forBlock['when_sell'] = function(block: Blockly.Block) {
  const taxNodes = TokenJSONGenerator.statementToCode(block, 'TAX_CONTAINER') as string;
  if (!taxNodes) return '';
  return `"sell": {\n${taxNodes}\n  }`;
};

TokenJSONGenerator.forBlock['when_transfer'] = function(block: Blockly.Block) {
  const taxNodes = TokenJSONGenerator.statementToCode(block, 'TAX_CONTAINER') as string;
  if (!taxNodes) return '';
  return `"transfer": {\n${taxNodes}\n  }`;
};

// 2. Tax
TokenJSONGenerator.forBlock['tax_container'] = function(block: Blockly.Block) {
  const taxRate = block.getFieldValue('TAX_RATE');
  const splitNodes = TokenJSONGenerator.statementToCode(block, 'SPLIT_LOGIC') as string;
  
  let code = `"tax": ${taxRate}`;
  if (splitNodes && splitNodes.trim()) {
    code += `,\n${splitNodes.trim()}`;
  }
  return code;
};

// 3. Split
TokenJSONGenerator.forBlock['split_logic'] = function(block: Blockly.Block) {
  const distNodes = TokenJSONGenerator.statementToCode(block, 'DISTRIBUTION') as string;
  return `"split": {\n${distNodes.trim()}\n    }`;
};

// 4. Actions/Distributions
TokenJSONGenerator.forBlock['liquidity_block'] = function(block: Blockly.Block) {
  const rate = block.getFieldValue('RATE');
  return `"liquidity": ${rate}`;
};

TokenJSONGenerator.forBlock['wallet_block'] = function(block: Blockly.Block) {
  const rate = block.getFieldValue('RATE');
  return `"wallet": ${rate}`;
};

TokenJSONGenerator.forBlock['burn_block'] = function(block: Blockly.Block) {
  const rate = block.getFieldValue('RATE');
  return `"burn": ${rate}`;
};

// 5. Limits (Global/Event Level)
TokenJSONGenerator.forBlock['max_wallet_limit'] = function(block: Blockly.Block) {
  const limit = block.getFieldValue('LIMIT');
  return `"maxWallet": ${limit}`;
};

TokenJSONGenerator.forBlock['max_tx_limit'] = function(block: Blockly.Block) {
  const limit = block.getFieldValue('LIMIT');
  return `"maxTx": ${limit}`;
};

// Expose a clean runner function
export function generateTokenConfig(workspace: Blockly.Workspace): string {
  // Reset the generator internal state
  TokenJSONGenerator.init(workspace);
  
  const jsonParts: string[] = [];
  
  // Generate code for all top-level blocks
  const blocks = workspace.getTopBlocks(true);
  for (let i = 0, block; (block = blocks[i]); i++) {
    const blockCode = TokenJSONGenerator.blockToCode(block);
    if (typeof blockCode === 'string' && blockCode.trim()) {
       jsonParts.push(blockCode.trim());
    }
  }
  
  let code = jsonParts.join(',\n');
  
  // Make sure we fix trailing commas generated inside { } or [ ]
  code = `{\n${code}\n}`;
  code = code.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
  
  return code;
}
