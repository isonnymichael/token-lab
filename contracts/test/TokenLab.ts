import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { network } from "hardhat";
import { parseUnits } from "viem";

describe("TokenLab", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  const [owner, otherAccount, liquidityWallet, treasuryWallet] = await viem.getWalletClients();

  const name = "TokenLab Test";
  const symbol = "TLAB";
  const totalSupply = parseUnits("1000000000", 18); // 1 Billion

  const distributionWallets = [
    owner.account.address,
    liquidityWallet.account.address,
    treasuryWallet.account.address
  ];
  const distributionPercents = [60n, 20n, 20n];

  async function deployToken() {
    const token = await viem.deployContract("TokenLab", [
      name,
      symbol,
      totalSupply,
      owner.account.address,
      distributionWallets,
      distributionPercents
    ]);
    return token;
  }

  it("Should set the right name and symbol", async function () {
    const token = await deployToken();
    assert.equal(await token.read.name(), name);
    assert.equal(await token.read.symbol(), symbol);
  });

  it("Should distribute tokens correctly on genesis", async function () {
    const token = await deployToken();

    assert.equal(
      await token.read.balanceOf([owner.account.address]),
      (totalSupply * 60n) / 100n
    );
    assert.equal(
      await token.read.balanceOf([liquidityWallet.account.address]),
      (totalSupply * 20n) / 100n
    );
    assert.equal(
      await token.read.balanceOf([treasuryWallet.account.address]),
      (totalSupply * 20n) / 100n
    );
  });

  it("Should fail transfer if trading is not enabled", async function () {
    const token = await deployToken();
    const amount = parseUnits("100", 18);

    // Initial transfer from excluded owner should succeed
    await token.write.transfer([otherAccount.account.address, amount], {
      account: owner.account,
    });

    // Transfer between non-excluded accounts should fail while trading is disabled
    await assert.rejects(
      token.write.transfer([treasuryWallet.account.address, amount], {
        account: otherAccount.account,
      }),
      /TokenLab: Trading not enabled/
    );
  });

  it("Should respect maxTxAmount if not excluded", async function () {
    const token = await deployToken();

    // default maxTxAmount is 1% = 10,000,000
    const maxTx = await token.read.maxTxAmount();
    const amount = maxTx + 1n;

    // Send some tokens to otherAccount from owner
    await token.write.transfer([otherAccount.account.address, amount], {
      account: owner.account,
    });
    
    // Enable trading so we can test limits separately
    await token.write.enableTrading({ account: owner.account });

    // Transfer exceeding maxTx from otherAccount should fail
    await assert.rejects(
      token.write.transfer([treasuryWallet.account.address, amount], {
        account: otherAccount.account,
      }),
      /TokenLab: Tx limit/
    );
  });

  it("Should emit TradingEnabled event", async function () {
    const token = await deployToken();

    await viem.assertions.emit(
      token.write.enableTrading({ account: owner.account }),
      token,
      "TradingEnabled"
    );
  });
});
