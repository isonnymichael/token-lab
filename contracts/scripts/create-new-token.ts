import { network } from "hardhat";

// simulation
const { viem } = await network.connect({
  network: "hardhatOp",
  chainType: "op",
});

import { parseUnits, zeroAddress } from "viem";

async function main() {
  const [deployer] = await viem.getWalletClients();
  console.log("Simulating TokenLab deployment with account:", deployer.account.address);

  // Configuration settings
  const name = "Sepolia Lab Token";
  const symbol = "SEPLAB";
  const totalSupplyRaw = parseUnits("10000000", 18); // 10 Million

  // 100% to Deployer for testing
  const distributionWallets = [deployer.account.address];
  const distributionPercents = [100n];

  console.log("Starting deployment...");
  const token = await viem.deployContract("TokenLab", [
    name,
    symbol,
    totalSupplyRaw,
    deployer.account.address,
    distributionWallets,
    distributionPercents
  ]);

  console.log(`\n✅ Token deployed successfully to: ${token.address}`);

  // Example Post-Deployment Configuration
  console.log("\nConfiguring taxes and limits...");

  console.log("- Configuring buy tax...");
  await token.write.configureBuyTax([
    100, // totalTax
    50,  // liquidityPercent
    0,   // burnPercent
    50,  // walletPercent
    deployer.account.address // walletTarget
  ], { account: deployer.account });
  console.log("- Buy tax configured");

  console.log("- Configuring sell tax...");
  await token.write.configureSellTax([
    500, // totalTax
    0,   // liquidityPercent
    0,   // burnPercent
    100, // walletPercent
    deployer.account.address // walletTarget
  ], { account: deployer.account });
  console.log("- Sell tax configured");

  console.log("- Configuring limits...");
  const maxWallet = (totalSupplyRaw * 2n) / 100n;
  const maxTx = (totalSupplyRaw * 1n) / 100n;
  await token.write.setLimits([maxWallet, maxTx], { account: deployer.account });
  console.log("- Limits configured");

  console.log("\nDeployment and configuration complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
