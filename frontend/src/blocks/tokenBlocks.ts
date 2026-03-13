import * as Blockly from 'blockly/core';

const COLORS = {
  EVENT: '#3b82f6', // blue-500
  TAX: '#f97316',   // orange-500
  SPLIT: '#eab308', // yellow-500
  LIQ: '#22c55e',   // green-500
  WALLET: '#a855f7',// purple-500
  BURN: '#ef4444',  // red-500
  LIMIT: '#6b7280', // gray-500
};

export function defineTokenBlocks() {
  // 1. EVENTS (Top Level)
  Blockly.Blocks['when_buy'] = {
    init: function () {
      this.appendDummyInput().appendField('⚡ WHEN BUY');
      this.appendStatementInput('TAX_CONTAINER').setCheck('TAX_CONTAINER');
      this.setColour(COLORS.EVENT);
      this.setTooltip('Triggered when tokens are bought from a DEX.');
    },
  };

  Blockly.Blocks['when_sell'] = {
    init: function () {
      this.appendDummyInput().appendField('⚡ WHEN SELL');
      this.appendStatementInput('TAX_CONTAINER').setCheck('TAX_CONTAINER');
      this.setColour(COLORS.EVENT);
      this.setTooltip('Triggered when tokens are sold to a DEX.');
    },
  };

  Blockly.Blocks['when_transfer'] = {
    init: function () {
      this.appendDummyInput().appendField('⚡ WHEN TRANSFER');
      this.appendStatementInput('TAX_CONTAINER').setCheck('TAX_CONTAINER');
      this.setColour(COLORS.EVENT);
      this.setTooltip('Triggered on standard wallet-to-wallet transfers.');
    },
  };

  // 2. TAX CONTAINER
  Blockly.Blocks['tax_container'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('💰 TAX')
        .appendField(new Blockly.FieldNumber(10, 0, 100), 'TAX_RATE')
        .appendField('%');
      this.appendStatementInput('SPLIT_LOGIC')
        .setCheck('SPLIT')
        .appendField('contains');
      this.setPreviousStatement(true, 'TAX_CONTAINER');
      this.setNextStatement(false); // Hierarchy stops here usually, or limit blocks follow
      this.setColour(COLORS.TAX);
      this.setTooltip('Defines the total tax taken during this event.');
    },
  };

  // 3. SPLIT LOGIC
  Blockly.Blocks['split_logic'] = {
    init: function () {
      this.appendDummyInput().appendField('🔀 SPLIT');
      this.appendStatementInput('DISTRIBUTION')
        .setCheck('DIST_BLOCK')
        .appendField('into');
      this.setPreviousStatement(true, 'SPLIT');
      this.setColour(COLORS.SPLIT);
      this.setTooltip('Splits the total tax into different distributions.');
    },
  };

  // 4. DISTRIBUTIONS
  Blockly.Blocks['liquidity_block'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('💧 LIQUIDITY')
        .appendField(new Blockly.FieldNumber(4, 0, 100), 'RATE')
        .appendField('%');
      this.setPreviousStatement(true, 'DIST_BLOCK');
      this.setNextStatement(true, 'DIST_BLOCK');
      this.setColour(COLORS.LIQ);
    },
  };

  Blockly.Blocks['wallet_block'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('🏦 SEND WALLET')
        .appendField(new Blockly.FieldNumber(3, 0, 100), 'RATE')
        .appendField('%');
      this.setPreviousStatement(true, 'DIST_BLOCK');
      this.setNextStatement(true, 'DIST_BLOCK');
      this.setColour(COLORS.WALLET);
    },
  };

  Blockly.Blocks['burn_block'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('🔥 BURN')
        .appendField(new Blockly.FieldNumber(3, 0, 100), 'RATE')
        .appendField('%');
      this.setPreviousStatement(true, 'DIST_BLOCK');
      this.setNextStatement(true, 'DIST_BLOCK');
      this.setColour(COLORS.BURN);
    },
  };

  // 5. LIMITS
  Blockly.Blocks['max_wallet_limit'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('🛡️ MAX WALLET')
        .appendField(new Blockly.FieldNumber(1, 0, 100), 'LIMIT')
        .appendField('% of supply');
      this.setPreviousStatement(true, ['TAX_CONTAINER', 'LIMIT']);
      this.setNextStatement(true, 'LIMIT');
      this.setColour(COLORS.LIMIT);
    },
  };

  Blockly.Blocks['max_tx_limit'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('🛡️ MAX TX')
        .appendField(new Blockly.FieldNumber(1, 0, 100), 'LIMIT')
        .appendField('% of supply');
      this.setPreviousStatement(true, ['TAX_CONTAINER', 'LIMIT']);
      this.setNextStatement(true, 'LIMIT');
      this.setColour(COLORS.LIMIT);
    },
  };
}

export const INITIAL_TOOLBOX = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Events',
      colour: '#3b82f6',
      contents: [
        { kind: 'block', type: 'when_buy' },
        { kind: 'block', type: 'when_sell' },
        { kind: 'block', type: 'when_transfer' },
      ],
    },
    {
      kind: 'category',
      name: 'Tax & Structure',
      colour: '#f97316',
      contents: [
        { kind: 'block', type: 'tax_container' },
        { kind: 'block', type: 'split_logic' },
      ],
    },
    {
      kind: 'category',
      name: 'Actions',
      colour: '#22c55e',
      contents: [
        { kind: 'block', type: 'liquidity_block' },
        { kind: 'block', type: 'wallet_block' },
        { kind: 'block', type: 'burn_block' },
      ],
    },
    {
      kind: 'category',
      name: 'Limits',
      colour: '#6b7280',
      contents: [
        { kind: 'block', type: 'max_wallet_limit' },
        { kind: 'block', type: 'max_tx_limit' },
      ],
    },
  ],
};
