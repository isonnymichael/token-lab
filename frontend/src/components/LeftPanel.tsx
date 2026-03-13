import { Search, Puzzle } from 'lucide-react';

const BLOCKS = [
  { category: 'Event', name: 'WHEN BUY', color: 'bg-blue-500', icon: '⚡' },
  { category: 'Event', name: 'WHEN SELL', color: 'bg-blue-500', icon: '⚡' },
  { category: 'Event', name: 'WHEN TRANSFER', color: 'bg-blue-500', icon: '⚡' },
  { category: 'Tax', name: 'TAX %', color: 'bg-orange-500', icon: '💰' },
  { category: 'Structure', name: 'SPLIT', color: 'bg-yellow-500', icon: '🔀' },
  { category: 'Action', name: 'LIQUIDITY %', color: 'bg-green-500', icon: '💧' },
  { category: 'Action', name: 'SEND WALLET %', color: 'bg-purple-500', icon: '🏦' },
  { category: 'Action', name: 'BURN %', color: 'bg-red-500', icon: '🔥' },
  { category: 'Limits', name: 'MAX WALLET %', color: 'bg-gray-500', icon: '🛡️' },
  { category: 'Limits', name: 'MAX TX %', color: 'bg-gray-500', icon: '🛡️' },
];

export default function LeftPanel() {
  return (
    <div className="w-[300px] bg-white border-r border-gray-200 flex flex-col shrink-0">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Blocks Library</h2>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search blocks..." 
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>
      <div className="p-4 overflow-y-auto flex-1 space-y-3">
        {BLOCKS.map((block, idx) => (
          <div 
            key={idx} 
            className="p-3 bg-white border border-gray-200 rounded-lg cursor-grab hover:shadow-md transition-shadow flex items-center gap-3 active:cursor-grabbing border-l-4"
            style={{ borderLeftColor: block.color.replace('bg-', '') }} // Rough visual tie, logic will be handled better later
          >
            <div className={`w-8 h-8 rounded-md ${block.color} flex items-center justify-center text-white shrink-0 shadow-inner`}>
              <Puzzle size={16} />
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{block.category}</div>
              <div className="font-bold text-gray-700">{block.icon} {block.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
