import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TokenFactoryModule", (m) => {
  // Deploy the Factory contract
  const factory = m.contract("TokenFactory");

  return { factory };
});
