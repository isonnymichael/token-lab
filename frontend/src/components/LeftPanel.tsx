import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, X, PieChart, Coins, CalendarClock } from 'lucide-react';
import { useAppState, type Allocation } from '../context/AppContext';



export default function LeftPanel() {
  const { tokenInfo, setTokenInfo, allocations, setAllocations } = useAppState();

  // Accordion state
  const [openSections, setOpenSections] = useState({
    supply: true,
    distribution: true,
    vesting: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSupplyUpdate = (field: keyof typeof tokenInfo, value: string | number) => {
    setTokenInfo({ ...tokenInfo, [field]: value });
  };

  const handleAllocationChange = (id: string, field: keyof Allocation, value: string | number) => {
    setAllocations(allocations.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const addAllocation = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setAllocations([...allocations, { id: newId, name: 'New Allocation', percentage: 0, color: '#94a3b8' }]);
  };

  const removeAllocation = (id: string) => {
    setAllocations(allocations.filter(a => a.id !== id));
  };

  const totalAllocation = allocations.reduce((sum, a) => sum + Number(a.percentage || 0), 0);
  const isValidAllocation = totalAllocation === 100;

  return (
    <div className="w-[320px] bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">

      {/* 1. SUPPLY */}
      <div className="border-b border-gray-100">
        <button
          onClick={() => toggleSection('supply')}
          className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Coins size={16} className="text-blue-500" />
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Supply</h2>
          </div>
          {openSections.supply ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
        </button>

        {openSections.supply && (
          <div className="p-4 space-y-4 bg-white">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Token Name</label>
              <input type="text" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700" value={tokenInfo.name} onChange={e => handleSupplyUpdate('name', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Symbol</label>
              <input type="text" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700" value={tokenInfo.symbol} onChange={e => handleSupplyUpdate('symbol', e.target.value.toUpperCase())} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Total Supply</label>
              <input type="number" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700 font-mono" value={tokenInfo.supply} onChange={e => handleSupplyUpdate('supply', Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Network</label>
              <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700" value={tokenInfo.network} onChange={e => handleSupplyUpdate('network', e.target.value)}>
                <option>Ethereum</option>
                <option>Base</option>
                <option>Arbitrum</option>
                <option>BSC</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 2. DISTRIBUTION (100%) */}
      <div className="border-b border-gray-100">
        <button
          onClick={() => toggleSection('distribution')}
          className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <PieChart size={16} className="text-purple-500" />
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Distribution</h2>
          </div>
          {openSections.distribution ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
        </button>

        {openSections.distribution && (
          <div className="p-4 bg-white">
            <div className={`mb-3 flex justify-between items-center text-xs font-bold px-2 py-1.5 rounded ${isValidAllocation ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              <span>Total Allocation</span>
              <span>{totalAllocation}% {isValidAllocation ? '✓' : '(Must equal 100%)'}</span>
            </div>

            <div className="space-y-2 mb-3">
              {allocations.map((alloc) => (
                <div key={alloc.id} className="flex items-center gap-2 group">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: alloc.color }}></div>
                  <input
                    type="text"
                    className="flex-1 px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                    value={alloc.name}
                    onChange={e => handleAllocationChange(alloc.id, 'name', e.target.value)}
                  />
                  <div className="relative w-16 shrink-0">
                    <input
                      type="number"
                      className="w-full px-2 py-1.5 pr-6 bg-gray-50 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700 font-mono"
                      value={alloc.percentage}
                      onChange={e => handleAllocationChange(alloc.id, 'percentage', Number(e.target.value))}
                    />
                    <span className="absolute right-2 top-1.5 text-xs text-gray-400">%</span>
                  </div>
                  <button onClick={() => removeAllocation(alloc.id)} className="text-gray-300 hover:text-red-500 transition-colors px-1 opacity-0 group-hover:opacity-100">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <button onClick={addAllocation} className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-xs font-semibold text-gray-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 flex items-center justify-center gap-1 transition-all">
              <Plus size={14} /> Add Allocation
            </button>
          </div>
        )}
      </div>

      {/* 3. VESTING */}
      <div className="border-b border-gray-100">
        <button
          onClick={() => toggleSection('vesting')}
          className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <CalendarClock size={16} className="text-yellow-500" />
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Vesting</h2>
          </div>
          {openSections.vesting ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
        </button>
        {openSections.vesting && (
          <div className="p-4 bg-white text-center">
            <span className="text-xs text-gray-400 font-medium italic border border-gray-100 bg-gray-50 py-2 px-4 rounded-lg block">Vesting Schedules Coming Soon</span>
          </div>
        )}
      </div>

    </div>
  );
}
