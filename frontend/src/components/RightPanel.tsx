import { Activity, Flame } from 'lucide-react';
import { useAppState } from '../context/AppContext';
import PieChartWidget from './analytics/PieChartWidget';
import FlowDiagramWidget from './analytics/FlowDiagramWidget';
import TokenomicsPieChartWidget from './analytics/TokenomicsPieChartWidget';

export default function RightPanel() {
  const { config, tokenInfo, allocations } = useAppState();

  // For MVP, if there are multiple events, we just visualize the 'buy' event tax if it exists, or fallback
  const activeEvent = config?.buy || config?.sell || config?.transfer;

  const taxRate = activeEvent?.tax || 0;
  const split = activeEvent?.split || {};

  const liqValue = split.liquidity || 0;
  const mktValue = split.wallet || 0;
  const burnValue = split.burn || 0;

  // Calculate unallocated tax (if split < total tax)
  const unallocated = Math.max(0, taxRate - (liqValue + mktValue + burnValue));

  const chartData = [
    { name: 'Liquidity', value: liqValue, color: '#22c55e' },
    { name: 'Marketing/Wallet', value: mktValue, color: '#a855f7' },
    { name: 'Burn', value: burnValue, color: '#ef4444' },
  ].filter(d => d.value > 0);

  if (unallocated > 0 && chartData.length > 0) {
    chartData.push({ name: 'Unallocated/Kept', value: unallocated, color: '#cbd5e1' });
  }

  // Use mock values if nothing is configured yet
  const displayData = chartData.length > 0 ? chartData : [
    { name: 'Empty', value: 100, color: '#f1f5f9' }
  ];

  const maxWallet = config?.maxWallet || 'Unset';
  const maxTx = config?.maxTx || 'Unset';
  const burnProjected = burnValue * 10000; // simplistic: per 1M vol.

  return (
    <div className="w-[350px] bg-white border-l border-gray-200 flex flex-col shrink-0 overflow-y-auto">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Live Preview</h2>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
      </div>

      {/* 1. Token Supply Details */}
      <div className="p-5 border-b border-gray-100 bg-gray-50">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Token Supply</h3>
        <div className="flex justify-between items-center mb-1">
          <span className="font-bold text-gray-800 text-lg leading-none">{tokenInfo.name} ({tokenInfo.symbol})</span>
          <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">{tokenInfo.network}</span>
        </div>
        <p className="text-xs font-semibold text-gray-500">{tokenInfo.supply.toLocaleString()} Total Max Supply</p>
      </div>

      {/* 2. Tokenomics Allocation (100%) */}
      <TokenomicsPieChartWidget allocations={allocations} totalSupply={tokenInfo.supply} />

      {/* 3. Transaction Mechanics */}
      <div className="bg-gray-50/30 border-b border-gray-100">
        <div className="p-4 pb-2">
           <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Transaction Mechanics</h3>
        </div>
        <PieChartWidget
        activeEvent={activeEvent}
        taxRate={taxRate}
        displayData={displayData}
        chartData={chartData}
      />

      {/* Transaction Flow Diagram (Static CSS/SVG Mock) */}
      <FlowDiagramWidget
        activeEvent={activeEvent}
        taxRate={taxRate}
        tokenSymbol={tokenInfo.symbol}
        liqValue={liqValue}
        mktValue={mktValue}
        burnValue={burnValue}
      />
      </div>

      {/* Token Stats Table */}
      <div className="p-5">
        <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Token Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
            <span className="text-sm text-gray-500 flex items-center gap-2"><Activity size={16} className="text-blue-500" /> Total Supply</span>
            <span className="font-bold text-gray-800">{tokenInfo.supply.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
            <span className="text-sm text-gray-500 flex items-center gap-2"><Flame size={16} className="text-red-500" /> Projected Burn</span>
            <span className="font-bold text-gray-800">{burnProjected.toLocaleString()} / 1M vol.</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
            <span className="text-sm text-gray-500 flex items-center gap-2">Max Wallet</span>
            <span className="font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded text-xs">
              {maxWallet === 'Unset' ? 'Unset' : `${maxWallet}%`}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
            <span className="text-sm text-gray-500 flex items-center gap-2">Max Tx</span>
            <span className="font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded text-xs">
              {maxTx === 'Unset' ? 'Unset' : `${maxTx}%`}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
