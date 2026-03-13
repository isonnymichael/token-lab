export interface TokenTemplate {
  id: string;
  name: string;
  description: string;
  xml: string;
}

export const TOKEN_TEMPLATES: TokenTemplate[] = [
  {
    id: 'standard-tax',
    name: 'Standard Tax Token',
    description: '10% Buy Tax split into Liquidity (4%), Marketing (3%), and Burn (3%).',
    xml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="when_buy" x="50" y="50">
    <statement name="TAX_CONTAINER">
      <block type="tax_container">
        <field name="TAX_RATE">10</field>
        <statement name="SPLIT_LOGIC">
          <block type="split_logic">
            <statement name="DISTRIBUTION">
              <block type="liquidity_block">
                <field name="RATE">4</field>
                <next>
                  <block type="wallet_block">
                    <field name="RATE">3</field>
                    <next>
                      <block type="burn_block">
                        <field name="RATE">3</field>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </statement>
          </block>
        </statement>
      </block>
    </statement>
  </block>
</xml>`
  },
  {
    id: 'deflationary',
    name: 'Deflationary Token',
    description: '5% Buy and Sell tax that is 100% burned.',
    xml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="when_buy" x="50" y="50">
    <statement name="TAX_CONTAINER">
      <block type="tax_container">
        <field name="TAX_RATE">5</field>
        <statement name="SPLIT_LOGIC">
          <block type="split_logic">
            <statement name="DISTRIBUTION">
              <block type="burn_block">
                <field name="RATE">5</field>
              </block>
            </statement>
          </block>
        </statement>
      </block>
    </statement>
  </block>
  <block type="when_sell" x="400" y="50">
    <statement name="TAX_CONTAINER">
      <block type="tax_container">
        <field name="TAX_RATE">5</field>
        <statement name="SPLIT_LOGIC">
          <block type="split_logic">
            <statement name="DISTRIBUTION">
              <block type="burn_block">
                <field name="RATE">5</field>
              </block>
            </statement>
          </block>
        </statement>
      </block>
    </statement>
  </block>
</xml>`
  },
  {
    id: 'liquidity-focus',
    name: 'Liquidity Focus',
    description: '10% Sell tax where all proceeds go back into the liquidity pool.',
    xml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="when_sell" x="50" y="50">
    <statement name="TAX_CONTAINER">
      <block type="tax_container">
        <field name="TAX_RATE">10</field>
        <statement name="SPLIT_LOGIC">
          <block type="split_logic">
            <statement name="DISTRIBUTION">
              <block type="liquidity_block">
                <field name="RATE">10</field>
              </block>
            </statement>
          </block>
        </statement>
      </block>
    </statement>
  </block>
</xml>`
  },
  {
    id: 'utility-limits',
    name: 'Utility Token (No Tax)',
    description: '0% Tax token with strict anti-whale limits (1% Max Tx, 2% Max Wallet).',
    xml: `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="max_wallet_limit" x="50" y="50">
    <field name="LIMIT">2</field>
    <next>
      <block type="max_tx_limit">
        <field name="LIMIT">1</field>
      </block>
    </next>
  </block>
</xml>`
  }
];
