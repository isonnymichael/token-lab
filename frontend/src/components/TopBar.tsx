import { useState } from 'react';
import { Rocket, AlertTriangle, X, CheckCircle2, Loader2 } from 'lucide-react';
import { useAppState } from '../context/AppContext';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { isAddress } from 'viem';
import { useDeployToken } from '../hooks/useDeployToken';

export default function TopBar() {
  const { isValid, errors, allocations, tokenInfo, config, setDeployedTokenAddress } = useAppState();
  const { isConnected } = useAccount();
  const { deploy, status, reset } = useDeployToken();

  const [showErrors, setShowErrors] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleDeployClick = () => {
    const errs: string[] = [];

    if (!tokenInfo.name.trim()) errs.push("Token Name is required");
    if (!tokenInfo.symbol.trim()) errs.push("Token Symbol is required");
    if (!tokenInfo.supply || tokenInfo.supply <= 0) errs.push("Total Supply must be > 0");
    if (tokenInfo.decimals === undefined || tokenInfo.decimals === null || tokenInfo.decimals < 0 || tokenInfo.decimals > 18) errs.push("Decimals must be between 0 and 18");

    const missingWallets = allocations.filter((a: any) => !a.wallet || a.wallet.trim() === '');
    if (missingWallets.length > 0) errs.push(`Missing ${missingWallets.length} distribution wallet(s)`);

    const invalidWallets = allocations.filter((a: any) => a.wallet && !isAddress(a.wallet));
    if (invalidWallets.length > 0) errs.push(`${invalidWallets.length} distribution wallet(s) have invalid address format`);

    const totalAlloc = allocations.reduce((sum: number, a: any) => sum + Number(a.percentage || 0), 0);
    if (totalAlloc !== 100) errs.push("Distribution allocation must equal 100%");

    if (!isValid && errors.length > 0) errs.push(`Blockly: ${errors[0]}`);

    if (errs.length > 0) {
      setValidationErrors(errs);
      setShowErrors(true);
    } else {
      setValidationErrors([]);
      setShowErrors(false);

      // Map mechanics from Blockly config
      const mechanics: any = {};

      // Helper to find a suitable project wallet from allocations
      const findProjectWallet = () => {
        const team = allocations.find((a: any) =>
          a.name.toLowerCase().includes('team') ||
          a.name.toLowerCase().includes('marketing') ||
          a.name.toLowerCase().includes('treasury')
        );
        return team?.wallet || allocations[0]?.wallet || '0x0000000000000000000000000000000000000000';
      };

      const projectWallet = findProjectWallet();

      if (config) {
        if (config.buy) {
          mechanics.buy = {
            tax: config.buy.tax,
            distribution: []
          };
          if (config.buy.split) {
            if (config.buy.split.liquidity) mechanics.buy.distribution.push({ type: 'liquidity', percent: config.buy.split.liquidity });
            if (config.buy.split.wallet) mechanics.buy.distribution.push({ type: 'wallet', target: projectWallet, percent: config.buy.split.wallet });
            if (config.buy.split.burn) mechanics.buy.distribution.push({ type: 'burn', percent: config.buy.split.burn });
          }
        }
        if (config.sell) {
          mechanics.sell = {
            tax: config.sell.tax,
            distribution: []
          };
          if (config.sell.split) {
            if (config.sell.split.liquidity) mechanics.sell.distribution.push({ type: 'liquidity', percent: config.sell.split.liquidity });
            if (config.sell.split.wallet) mechanics.sell.distribution.push({ type: 'wallet', target: projectWallet, percent: config.sell.split.wallet });
            if (config.sell.split.burn) mechanics.sell.distribution.push({ type: 'burn', percent: config.sell.split.burn });
          }
        }
        if (config.transfer) {
          mechanics.transfer = {
            tax: config.transfer.tax,
            distribution: []
          };
          if (config.transfer.split) {
            if (config.transfer.split.liquidity) mechanics.transfer.distribution.push({ type: 'liquidity', percent: config.transfer.split.liquidity });
            if (config.transfer.split.wallet) mechanics.transfer.distribution.push({ type: 'wallet', target: projectWallet, percent: config.transfer.split.wallet });
            if (config.transfer.split.burn) mechanics.transfer.distribution.push({ type: 'burn', percent: config.transfer.split.burn });
          }
        }
      }

      // Bundle data based on output-example.json
      const outputData = {
        metadata: {
          name: tokenInfo.name,
          symbol: tokenInfo.symbol,
          logoURI: tokenInfo.logoUrl,
          description: tokenInfo.description
        },
        supply: {
          totalSupply: tokenInfo.supply.toString(),
          decimals: tokenInfo.decimals,
          mintable: tokenInfo.mintable,
          burnable: tokenInfo.burnable
        },
        distribution: allocations.map((a: any) => ({
          name: a.name,
          percent: a.percentage,
          wallet: a.wallet
        })),
        mechanics: mechanics,
        limits: {
          maxWalletPercent: config?.maxWallet,
          maxTxPercent: config?.maxTx
        },
        deployment: {
          network: tokenInfo.network,
          owner: allocations.find((a: any) => a.name.toLowerCase().includes('team'))?.wallet || allocations[0]?.wallet
        }
      };

      // Trigger the actual deployment
      deploy(outputData).then(addr => {
        if (addr) setDeployedTokenAddress(addr);
      }).catch((err: any) => {
        console.error("Deployment Error:", err);
      });
    }
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-50 shadow-sm relative">
      <div className="flex items-center gap-3 group">
        <div className="relative">
          <img src="/favicon.svg" alt="TokenLab Logo" className="w-9 h-9 group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="flex flex-col -gap-1">
          <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none">Token<span className="text-blue-600">Lab</span></h1>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">Deploy Advanced Tokens Effortlessly</span>
        </div>
      </div>

      <div className="flex-1"></div>

      <div className="flex items-center gap-3">
        {showErrors && validationErrors.length > 0 && (
          <div className="flex flex-col items-end mr-2 relative z-50">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-red-500 bg-red-50 px-3 py-1.5 rounded-md border border-red-100 pr-8">
              <AlertTriangle size={14} />
              Invalid Configuration
              <button onClick={() => setShowErrors(false)} className="absolute hover:cursor-pointer right-2 text-red-400 hover:text-red-600">
                <X size={12} />
              </button>
            </div>
            <div className="absolute top-10 right-0 bg-white border border-red-100 rounded shadow-lg z-5000 min-w-max overflow-hidden">
              <ul className="text-left">
                {validationErrors.map((err, i) => (
                  <li key={i} className="text-[10px] text-red-500 font-medium px-3 py-1.5 border-b border-red-50 last:border-0 hover:bg-red-50/50">
                    • {err}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {!isConnected ? (
          <ConnectButton chainStatus="none" />
        ) : (
          <>
            <button
              onClick={handleDeployClick}
              className={`flex hover:cursor-pointer items-center gap-2 px-5 py-2 rounded-lg font-semibold transition-colors shadow-sm bg-blue-600 hover:bg-blue-700 text-white`}
            >
              <Rocket size={18} />
              Deploy
            </button>
            <ConnectButton chainStatus="none" />
          </>
        )}
      </div>

      {/* Deployment Status Modal */}
      {status.step !== 'idle' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-gray-100 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
            {status.step === 'success' ? (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                <CheckCircle2 size={32} />
              </div>
            ) : status.step === 'error' ? (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
                <AlertTriangle size={32} />
              </div>
            ) : (
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4 relative">
                <Loader2 size={32} className="animate-spin" />
              </div>
            )}

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {status.step === 'deploying' && 'Creating Token'}
              {status.step === 'configuring' && 'Configuring Rules'}
              {status.step === 'enabling' && 'Going Live'}
              {status.step === 'success' && 'Deployment Success!'}
              {status.step === 'error' && 'Deployment Failed'}
            </h3>

            <p className="text-gray-500 text-sm mb-6">
              {status.message}
            </p>

            {status.tokenAddress && (
              <div className="w-full bg-gray-50 rounded-lg p-3 mb-6 text-left">
                <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Contract Address</span>
                <code className="text-[11px] text-blue-600 font-mono break-all leading-tight">
                  {status.tokenAddress}
                </code>
              </div>
            )}

            {(status.step === 'success' || status.step === 'error') && (
              <button
                onClick={reset}
                className="w-full hover:cursor-pointer py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
