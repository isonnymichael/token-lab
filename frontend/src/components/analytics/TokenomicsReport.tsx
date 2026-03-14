import { PieChart, Pie, Cell } from 'recharts';
import type { TokenInfo, Allocation, TokenConfig } from '../../context/AppContext';

interface TokenomicsReportProps {
  tokenInfo: TokenInfo;
  allocations: Allocation[];
  config: TokenConfig | null;
  deployedTokenAddress: string | null;
}

export default function TokenomicsReport({ 
  tokenInfo, 
  allocations, 
  config, 
  deployedTokenAddress 
}: TokenomicsReportProps) {
  
  const activeEvent = config?.buy || config?.sell || config?.transfer;
  const taxRate = activeEvent?.tax || 0;
  const split = activeEvent?.split || {};
  
  const liqValue = split.liquidity || 0;
  const mktValue = split.wallet || 0;
  const burnValue = split.burn || 0;

  const maxWallet = config?.maxWallet || 'Unset';
  const maxTx = config?.maxTx || 'Unset';

  // Pie Chart Data for the Report
  const chartData = allocations.filter(a => a.percentage > 0).map(a => ({
    name: a.name,
    value: a.percentage,
    color: a.color
  }));

  return (
    <div id="tokenomics-report" className="print-only">
      <header className="report-header">
        <div>
          <h1 className="report-title">Tokenomics Executive Report</h1>
          <p className="text-slate-500 font-medium font-sans">Verified Protocol: TokenLab v1.0</p>
        </div>
        <div className="text-right">
          <div className="stamp">Official Protocol</div>
          <p className="text-[10px] mt-2 text-slate-400 font-mono">
            {new Date().toLocaleDateString()} • {tokenInfo.network}
          </p>
        </div>
      </header>

      {/* Identity Section */}
      <section className="report-section">
        <h2 className="section-title">Token Identity</h2>
        <div className="flex gap-6 items-start mb-6">
          {tokenInfo.logoUrl && (
            <img 
              src={tokenInfo.logoUrl} 
              alt="Logo" 
              className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm"
            />
          )}
          <div className="flex-1">
            <h3 className="text-2xl font-black text-slate-900 leading-none mb-1">{tokenInfo.name} ({tokenInfo.symbol})</h3>
            {tokenInfo.description && (
              <p className="text-xs text-slate-500 mt-2 italic leading-relaxed">"{tokenInfo.description}"</p>
            )}
          </div>
        </div>

        <div className="stat-grid">
          <div className="stat-card">
            <p className="stat-label">Total Max Supply</p>
            <p className="stat-value font-mono">{tokenInfo.supply.toLocaleString()}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Network</p>
            <p className="stat-value text-blue-600 font-bold uppercase tracking-wider">{tokenInfo.network}</p>
          </div>
        </div>
      </section>

      {/* Distribution Section with Pie Chart */}
      <section className="report-section">
        <h2 className="section-title">Distribution Strategy</h2>
        <div className="flex gap-12 items-center">
          {/* Pie Chart Area - Fixed size for print stability - NO ResponsiveContainer */}
          <div className="w-[220px] h-[220px] shrink-0 flex items-center justify-center border border-slate-100 rounded-2xl bg-slate-50/30">
            <PieChart width={200} height={200}>
              <Pie
                data={chartData}
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="#fff"
                strokeWidth={2}
                isAnimationActive={false} // CRITICAL FOR PRINT
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>

          <div className="flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/50">
                  <th className="p-2 text-[9px] font-bold uppercase text-slate-500 border border-slate-100">Category</th>
                  <th className="p-2 text-[9px] font-bold uppercase text-slate-500 border border-slate-100 text-right">Allocation</th>
                  <th className="p-2 text-[9px] font-bold uppercase text-slate-500 border border-slate-100 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {allocations.map((a, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    <td className="p-2 text-xs font-semibold flex items-center gap-2">
                      <svg width="10" height="10" viewBox="0 0 10 10" className="shrink-0">
                        <circle cx="5" cy="5" r="4" fill={a.color} />
                      </svg>
                      {a.name}
                    </td>
                    <td className="p-2 text-xs text-right font-mono font-bold text-slate-700">{a.percentage}%</td>
                    <td className="p-2 text-xs text-right font-mono text-slate-500">
                      {((tokenInfo.supply * a.percentage) / 100).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Automated Rules & Security Section */}
      <section className="report-section print-break-inside-avoid">
        <h2 className="section-title">Security & Automated Rules</h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="stat-card">
            <p className="stat-label">Transaction Fee Structure</p>
            <div className="tax-row">
              <span className="text-xs font-bold text-slate-700">Total Protocol Tax</span>
              <span className="text-sm font-black text-blue-600">{taxRate}%</span>
            </div>
            <div className="space-y-1 mt-2">
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Auto-Liquidity Provision</span>
                <span className="font-bold">{liqValue}%</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Deflationary Burn Mechanism</span>
                <span className="font-bold">{burnValue}%</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Project Development Fund</span>
                <span className="font-bold">{mktValue}%</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <p className="stat-label">Anti-Whale Protection</p>
            <div className="tax-row">
              <span className="text-xs text-slate-600">Wallet Holding Limit</span>
              <span className="text-xs font-bold">{maxWallet === 'Unset' ? 'Disabled' : `${maxWallet}% Supply`}</span>
            </div>
            <div className="tax-row">
              <span className="text-xs text-slate-600">Max Transaction Size</span>
              <span className="text-xs font-bold">{maxTx === 'Unset' ? 'Disabled' : `${maxTx}% Supply`}</span>
            </div>
            <div className="pt-2 text-[9px] text-slate-400 italic">
               * These protections are hard-coded into the smart contract logic.
            </div>
          </div>
        </div>
      </section>

      {deployedTokenAddress && (
        <footer className="mt-20 pt-8 border-t border-slate-200 text-center">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Authenticated Smart Contract</p>
          <div className="inline-block bg-slate-50 border border-slate-100 px-6 py-3 rounded-xl">
             <code className="text-[10px] font-mono text-blue-600 break-all">{deployedTokenAddress}</code>
          </div>
          <p className="text-[9px] text-slate-400 mt-4 italic">
            Disclaimer: This document is an executive summary of the token configuration as verified on the {tokenInfo.network} blockchain. 
            Final configuration should be cross-referenced with the public ledger.
          </p>
        </footer>
      )}
    </div>
  );
}
