import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseUnits } from "viem";

export default buildModule("TokenLabModule", (m) => {
  // Example configuration for deployment
  const name = "TokenLab Test";
  const symbol = "TLAB";
  const totalSupplyRaw = parseUnits("1000000000", 18); // 1 Billion
  
  // Use account 0 as the deployer and primary owner
  const deployer = m.getAccount(0);

  const distributionWallets = [deployer];
  const distributionPercents = [100n]; // 100%

  const tokenLab = m.contract("TokenLab", [
    name,
    symbol,
    totalSupplyRaw,
    deployer,
    distributionWallets,
    distributionPercents
  ]);

  return { tokenLab };
});
