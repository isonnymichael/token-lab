import { useState } from 'react';
import { Rocket, AlertTriangle, X } from 'lucide-react';
import { useAppState } from '../context/AppContext';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export default function TopBar() {
  const { isValid, errors, allocations, tokenInfo } = useAppState();
  const { isConnected } = useAccount();

  const [showErrors, setShowErrors] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleDeployClick = () => {
    const errs: string[] = [];

    if (!tokenInfo.name.trim()) errs.push("Token Name is required");
    if (!tokenInfo.symbol.trim()) errs.push("Token Symbol is required");
    if (!tokenInfo.supply || tokenInfo.supply <= 0) errs.push("Total Supply must be > 0");
    if (tokenInfo.decimals === undefined || tokenInfo.decimals === null || tokenInfo.decimals < 0 || tokenInfo.decimals > 18) errs.push("Decimals must be between 0 and 18");

    const missingWallets = allocations.filter(a => !a.wallet || a.wallet.trim() === '');
    if (missingWallets.length > 0) errs.push(`Missing ${missingWallets.length} distribution wallet(s)`);

    const totalAlloc = allocations.reduce((sum, a) => sum + Number(a.percentage || 0), 0);
    if (totalAlloc !== 100) errs.push("Distribution allocation must equal 100%");

    if (!isValid && errors.length > 0) errs.push(`Blockly: ${errors[0]}`);

    if (errs.length > 0) {
      setValidationErrors(errs);
      setShowErrors(true);
    } else {
      setValidationErrors([]);
      setShowErrors(false);
      alert("Validation Passed! Ready to Deploy Smart Contract.");
    }
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-50 shadow-sm relative">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">T</div>
        <h1 className="text-xl font-bold text-gray-800">TokenLab</h1>
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
    </div>
  );
}
