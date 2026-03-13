import { Rocket, AlertTriangle } from 'lucide-react';
import { useAppState } from '../context/AppContext';

export default function TopBar() {
  const { isValid, errors, tokenInfo, setTokenInfo } = useAppState();

  const handleUpdate = (field: keyof typeof tokenInfo, value: string | number) => {
    setTokenInfo({ ...tokenInfo, [field]: value });
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">T</div>
        <h1 className="text-xl font-bold text-gray-800">TokenLab</h1>
      </div>
      
      <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
        <input type="text" placeholder="Token Name" className="px-3 py-1.5 bg-white border border-gray-200 rounded text-sm w-32 focus:outline-none focus:ring-1 focus:ring-blue-500" value={tokenInfo.name} onChange={e => handleUpdate('name', e.target.value)} />
        <input type="text" placeholder="SYMBOL" className="px-3 py-1.5 bg-white border border-gray-200 rounded text-sm w-24 focus:outline-none focus:ring-1 focus:ring-blue-500" value={tokenInfo.symbol} onChange={e => handleUpdate('symbol', e.target.value.toUpperCase())} />
        <input type="number" placeholder="Total Supply" className="px-3 py-1.5 bg-white border border-gray-200 rounded text-sm w-36 focus:outline-none focus:ring-1 focus:ring-blue-500" value={tokenInfo.supply} onChange={e => handleUpdate('supply', Number(e.target.value))} />
        <select className="px-3 py-1.5 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" value={tokenInfo.network} onChange={e => handleUpdate('network', e.target.value)}>
          <option>Ethereum</option>
          <option>Base</option>
          <option>Arbitrum</option>
          <option>BSC</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        {!isValid && errors.length > 0 && (
          <div className="flex flex-col items-end">
             <div className="flex items-center gap-1.5 text-xs font-semibold text-red-500 bg-red-50 px-3 py-1.5 rounded-md border border-red-100">
               <AlertTriangle size={14} />
               Invalid Workspace
             </div>
             <span className="text-[10px] text-red-500 font-medium absolute top-14">{errors[0]}</span>
          </div>
        )}
        <button 
          disabled={!isValid}
          className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold transition-colors shadow-sm ${
            isValid 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Rocket size={18} />
          Deploy
        </button>
      </div>
    </div>
  );
}
