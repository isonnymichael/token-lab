import { Droplets, Flame, Building2 } from 'lucide-react';

interface FlowDiagramWidgetProps {
  activeEvent: any;
  taxRate: number;
  tokenSymbol: string;
  liqValue: number;
  mktValue: number;
  burnValue: number;
}

export default function FlowDiagramWidget({ activeEvent, taxRate, tokenSymbol, liqValue, mktValue, burnValue }: FlowDiagramWidgetProps) {
  return (
    <div className="p-5 border-b border-gray-100 bg-gray-50/50">
      <h3 className="text-xs font-bold text-gray-400 uppercase mb-4">Transaction Flow Diagram</h3>
      {activeEvent && taxRate > 0 ? (
        <div className="flex flex-col items-center gap-2">
          <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-bold text-sm w-full text-center border border-blue-200">
            100 {tokenSymbol} (Transfer)
          </div>
          <div className="h-4 w-px bg-gray-300"></div>
          <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg font-bold text-sm w-full border border-orange-200 flex justify-between">
            <span>TAX ({taxRate}%)</span>
            <span>{taxRate} {tokenSymbol}</span>
          </div>
          <div className={`w-full flex justify-between px-4 mt-2 max-w-[250px]`}>
            {liqValue > 0 && (
              <div className="flex flex-col items-center gap-1">
                <div className="h-6 w-px bg-gray-300"></div>
                <div className="bg-green-100 text-green-700 p-2 rounded border border-green-200 shadow-sm" title="Liquidity">
                  <Droplets size={16} />
                </div>
                <span className="text-[10px] font-bold text-gray-500">{liqValue} {tokenSymbol}</span>
              </div>
            )}
            {mktValue > 0 && (
              <div className="flex flex-col items-center gap-1">
                <div className="h-6 w-px bg-gray-300"></div>
                <div className="bg-purple-100 text-purple-700 p-2 rounded border border-purple-200 shadow-sm" title="Marketing">
                  <Building2 size={16} />
                </div>
                <span className="text-[10px] font-bold text-gray-500">{mktValue} {tokenSymbol}</span>
              </div>
            )}
            {burnValue > 0 && (
              <div className="flex flex-col items-center gap-1">
                <div className="h-6 w-px bg-gray-300"></div>
                <div className="bg-red-100 text-red-700 p-2 rounded border border-red-200 shadow-sm" title="Burn">
                  <Flame size={16} />
                </div>
                <span className="text-[10px] font-bold text-gray-500">{burnValue} {tokenSymbol}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-400 text-center py-6 border border-dashed border-gray-300 rounded-lg">
          Add blocks to visualize flow.
        </div>
      )}
    </div>
  );
}
