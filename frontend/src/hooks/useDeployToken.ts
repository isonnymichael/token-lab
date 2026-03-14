import { useState } from 'react';
import { useWriteContract, usePublicClient, useAccount } from 'wagmi';
import { parseUnits, type Address } from 'viem';
import TokenFactoryArtifact from '@contracts/artifacts/contracts/TokenFactory.sol/TokenFactory.json';
import TokenLabArtifact from '@contracts/artifacts/contracts/TokenLab.sol/TokenLab.json';
import DeployedAddresses from '@contracts/ignition/deployments/chain-11155111/deployed_addresses.json';

const TokenFactoryABI = TokenFactoryArtifact.abi;
const TokenLabABI = TokenLabArtifact.abi;
const FactoryAddress = DeployedAddresses["TokenFactoryModule#TokenFactory"] as Address;

export interface DeploymentStatus {
  step: 'idle' | 'validating' | 'deploying' | 'configuring' | 'enabling' | 'success' | 'error';
  message: string;
  txHash?: string;
  tokenAddress?: string;
}

export function useDeployToken() {
  const [status, setStatus] = useState<DeploymentStatus>({ step: 'idle', message: '' });
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  const { address: userAddress } = useAccount();

  const deploy = async (data: any) => {
    try {
      if (!publicClient) throw new Error("Wallet not connected");

      setStatus({ step: 'deploying', message: 'Creating token via Factory...' });

      // 1. Create Token via Factory
      const factoryAddress = FactoryAddress;
      
      const spawnHash = await writeContractAsync({
        address: factoryAddress,
        abi: TokenFactoryABI,
        functionName: 'createToken',
        args: [
          data.metadata.name,
          data.metadata.symbol,
          parseUnits(data.supply.totalSupply, data.supply.decimals),
          data.distribution.map((d: any) => d.wallet),
          data.distribution.map((d: any) => BigInt(d.percent))
        ],
      });

      const receipt = await publicClient.waitForTransactionReceipt({ 
        hash: spawnHash,
        timeout: 300_000, // 5 minutes for Sepolia
      });
      
      // Find the TokenCreated event to get the address
      // The event is: TokenCreated(address indexed tokenAddress, string name, string symbol, address indexed creator)
      // Logic: It's the first log if coming from the factory's createToken
      const event = receipt.logs.find(log => log.address.toLowerCase() === factoryAddress.toLowerCase());
      if (!event) throw new Error("Could not find deployment event");
      
      // Alternatively, we can use the address returned by the contract if we were using a different method
      // but with events it's safer across different providers. 
      // For now, let's assume the first indexed parameter is the address.
      // In our TokenFactory.sol: emit TokenCreated(tokenAddress, name, symbol, msg.sender);
      // tokenAddress is index 1 in topics (0 is signature, 1 is indexed tokenAddress)
      const tokenAddress = ('0x' + event.topics[1]?.slice(26)) as Address;
      
      setStatus({ step: 'configuring', message: 'Configuring mechanics...', tokenAddress });

      // 2. Configure Mechanics (Taxes & Limits)
      // Note: We do these sequentially for simplicity in this version
      
      // Buy Tax
      if (data.mechanics.buy) {
        const split = data.mechanics.buy.distribution || [];
        const liquidity = split.find((s: any) => s.type === 'liquidity')?.percent || 0;
        const burn = split.find((s: any) => s.type === 'burn')?.percent || 0;
        const wallet = split.find((s: any) => s.type === 'wallet')?.percent || 0;
        const target = split.find((s: any) => s.type === 'wallet')?.target || userAddress;

        const tx = await writeContractAsync({
          address: tokenAddress,
          abi: TokenLabABI,
          functionName: 'configureBuyTax',
          args: [
            data.mechanics.buy.tax * 100, // Basis points
            liquidity * 100,
            burn * 100,
            wallet * 100,
            target as Address
          ],
        });
        await publicClient.waitForTransactionReceipt({ 
          hash: tx,
          timeout: 300_000 
        });
      }

      // Sell Tax
      if (data.mechanics.sell) {
        const split = data.mechanics.sell.distribution || [];
        const liquidity = split.find((s: any) => s.type === 'liquidity')?.percent || 0;
        const burn = split.find((s: any) => s.type === 'burn')?.percent || 0;
        const wallet = split.find((s: any) => s.type === 'wallet')?.percent || 0;
        const target = split.find((s: any) => s.type === 'wallet')?.target || userAddress;

        const tx = await writeContractAsync({
          address: tokenAddress,
          abi: TokenLabABI,
          functionName: 'configureSellTax',
          args: [
            data.mechanics.sell.tax * 100,
            liquidity * 100,
            burn * 100,
            wallet * 100,
            target as Address
          ],
        });
        await publicClient.waitForTransactionReceipt({ 
          hash: tx,
          timeout: 300_000 
        });
      }

      // Limits
      if (data.limits && (data.limits.maxWalletPercent || data.limits.maxTxPercent)) {
        const totalSupply = parseUnits(data.supply.totalSupply, data.supply.decimals);
        const maxWallet = data.limits.maxWalletPercent 
          ? (totalSupply * BigInt(data.limits.maxWalletPercent * 100)) / 10000n
          : totalSupply; // No limit
        const maxTx = data.limits.maxTxPercent 
          ? (totalSupply * BigInt(data.limits.maxTxPercent * 100)) / 10000n
          : totalSupply;

        const tx = await writeContractAsync({
          address: tokenAddress,
          abi: TokenLabABI,
          functionName: 'setLimits',
          args: [maxWallet, maxTx],
        });
        await publicClient.waitForTransactionReceipt({ 
          hash: tx,
          timeout: 300_000 
        });
      }

      // 3. Enable Trading
      setStatus({ step: 'enabling', message: 'Enabling trading...', tokenAddress });
      const enableTx = await writeContractAsync({
        address: tokenAddress,
        abi: TokenLabABI,
        functionName: 'enableTrading',
      });
      await publicClient.waitForTransactionReceipt({ 
        hash: enableTx,
        timeout: 300_000 
      });

      setStatus({ step: 'success', message: 'Deployment complete!', tokenAddress });
      return tokenAddress;

    } catch (error: any) {
      console.error("Deployment failed:", error);
      setStatus({ step: 'error', message: error.message || 'Deployment failed' });
      throw error;
    }
  };

  return { deploy, status, reset: () => setStatus({ step: 'idle', message: '' }) };
}
