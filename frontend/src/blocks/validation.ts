import * as Blockly from 'blockly/core';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateTokenWorkspace(workspace: Blockly.Workspace): ValidationResult {
  const errors: string[] = [];
  let isValid = true;

  // Clear all previous warnings
  const allBlocks = workspace.getAllBlocks(false);
  allBlocks.forEach(block => block.setWarningText(null));

  allBlocks.forEach(block => {
    const type = block.type;

    // RULE 1: TAX must be under an EVENT
    if (type === 'tax_container') {
      const parent = block.getSurroundParent();
      if (!parent || !parent.type.startsWith('when_')) {
        block.setWarningText('TAX block must be placed inside an EVENT block (e.g., WHEN BUY).');
        errors.push('Orphaned TAX block.');
        isValid = false;
      }
    }

    // RULE 2: SPLIT must be under TAX
    if (type === 'split_logic') {
      const parent = block.getSurroundParent();
      if (!parent || parent.type !== 'tax_container') {
        block.setWarningText('SPLIT block must be placed inside a TAX block.');
        errors.push('Orphaned SPLIT block.');
        isValid = false;
      }
    }

    // RULE 3: DISTRIBUTION must be under SPLIT
    if (['liquidity_block', 'wallet_block', 'burn_block'].includes(type)) {
      const parent = block.getSurroundParent();
      if (!parent || parent.type !== 'split_logic') {
        block.setWarningText('Distribution blocks (Liquidity/Wallet/Burn) must be placed inside a SPLIT block.');
        errors.push(`Orphaned ${type}.`);
        isValid = false;
      }
    }

    // RULE 4: LIMITS (max_wallet_limit, max_tx_limit) can float anywhere (global) or under events. 
    //   -> No strict parent requirement, so they don't break validation.

    // RULE 4: SPLIT sum must not exceed TAX amount
    if (type === 'split_logic') {
      const taxParent = block.getSurroundParent();
      if (taxParent && taxParent.type === 'tax_container') {
        const totalTax = taxParent.getFieldValue('TAX_RATE') || 0;
        
        // Sum up all distribution children
        let distSum = 0;
        let currentDist = block.getInputTargetBlock('DISTRIBUTION');
        while (currentDist) {
          if (['liquidity_block', 'wallet_block', 'burn_block'].includes(currentDist.type)) {
            distSum += Number(currentDist.getFieldValue('RATE') || 0);
          }
          currentDist = currentDist.getNextBlock();
        }

        if (distSum > totalTax) {
          block.setWarningText(`SPLIT total (${distSum}%) exceeds available TAX (${totalTax}%).`);
          errors.push(`Tax Split mismatch.`);
          isValid = false;
        }
      }
    }
  });

  return { isValid, errors };
}
