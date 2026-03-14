import { X, HelpCircle, ArrowRight, Zap, Shield, Info } from 'lucide-react';

interface MechanicsInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MechanicsInfoModal({ isOpen, onClose }: MechanicsInfoModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-blue-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <HelpCircle size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Understanding Mechanics</h2>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-0.5">Deployment & Economic Guide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:cursor-pointer hover:text-gray-600 hover:bg-white p-2 rounded-xl transition-all shadow-sm border border-transparent hover:border-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto space-y-8">
          
          {/* 1. Core Concept */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Zap size={18} className="text-amber-500" />
              <h3 className="font-black text-gray-800 uppercase text-sm tracking-wider">How Taxes Work</h3>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-sm leading-relaxed text-amber-900 font-medium">
              Taxes are automatically deducted during <span className="font-black">Decentralized Exchange (DEX)</span> swaps. 
              The contract identifies "Buys" and "Sells" based on whether tokens are moving to or from an official Liquidity Pool.
            </div>
          </section>

          {/* 2. Visual Flow */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="border border-gray-100 rounded-2xl p-5 bg-gray-50/50">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 block">The BUY Event</span>
                <div className="flex items-center justify-between gap-2 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                   <div className="text-center">
                      <div className="text-[10px] font-bold text-gray-400 mb-1">DEX POOL</div>
                      <div className="w-8 h-8 rounded-full bg-blue-100 mx-auto" />
                   </div>
                   <ArrowRight size={16} className="text-gray-300" />
                   <div className="text-center">
                      <div className="text-[10px] font-bold text-gray-400 mb-1">TAX (X%)</div>
                      <div className="w-8 h-8 rounded-full bg-red-100 mx-auto flex items-center justify-center text-red-600 text-[10px] font-black">%</div>
                   </div>
                   <ArrowRight size={16} className="text-gray-300" />
                   <div className="text-center">
                      <div className="text-[10px] font-bold text-gray-400 mb-1">USER</div>
                      <div className="w-8 h-8 rounded-full bg-green-100 mx-auto" />
                   </div>
                </div>
                <p className="text-[11px] text-gray-500 mt-3 italic">User receives (Amount - Tax). Tax is split between Liquidity, Burn, and Wallet.</p>
             </div>

             <div className="border border-gray-100 rounded-2xl p-5 bg-gray-50/50">
                <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest mb-2 block">The SELL Event</span>
                <div className="flex items-center justify-between gap-2 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                   <div className="text-center">
                      <div className="text-[10px] font-bold text-gray-400 mb-1">USER</div>
                      <div className="w-8 h-8 rounded-full bg-green-100 mx-auto" />
                   </div>
                   <ArrowRight size={16} className="text-gray-300" />
                   <div className="text-center">
                      <div className="text-[10px] font-bold text-gray-400 mb-1">TAX (X%)</div>
                      <div className="w-8 h-8 rounded-full bg-red-100 mx-auto flex items-center justify-center text-red-600 text-[10px] font-black">%</div>
                   </div>
                   <ArrowRight size={16} className="text-gray-300" />
                   <div className="text-center">
                      <div className="text-[10px] font-bold text-gray-400 mb-1">DEX POOL</div>
                      <div className="w-8 h-8 rounded-full bg-blue-100 mx-auto" />
                   </div>
                </div>
                <p className="text-[11px] text-gray-500 mt-3 italic">Seller pays tax on exit. Helps sustain project funding and liquidity depth.</p>
             </div>
          </section>

          {/* 3. Manual Step */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Shield size={18} className="text-blue-500" />
              <h3 className="font-black text-gray-800 uppercase text-sm tracking-wider">Required Post-Launch Steps</h3>
            </div>
            <div className="space-y-4">
               <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-1">1</div>
                  <div>
                     <h4 className="font-bold text-gray-900 text-sm">Create the Pool (Liquidity)</h4>
                     <p className="text-[12px] text-gray-500">Go to Uniswap and add your tokens + ETH. This creates a <span className="font-bold text-gray-700">Pair Address</span> (the "Home" for your token's trades).</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-1">2</div>
                  <div>
                     <h4 className="font-bold text-gray-900 text-sm">Tell your Token about the Pool</h4>
                     <p className="text-[12px] text-gray-500 mb-2">Your token doesn't know what Uniswap is until you tell it! You must "Register" the Pool so the tax knows when to trigger.</p>
                     <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 space-y-2">
                        <p className="text-[11px] font-bold text-blue-800">How to do it:</p>
                        <ol className="text-[10px] space-y-1 text-blue-700 list-decimal ml-4 font-medium">
                           <li>Copy the <span className="font-bold underline text-blue-900">Pair Address</span> Uniswap gave you.</li>
                           <li>Go to your token's Etherscan page &rarr; <span className="font-bold">Contract</span> &rarr; <span className="font-bold">Write</span>.</li>
                           <li>Find <code className="bg-white px-1 rounded font-bold">setAutomatedMarketMakerPair</code>.</li>
                           <li>Paste the address and set the second box to <code className="bg-white px-1 rounded font-bold">true</code>.</li>
                        </ol>
                     </div>
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-1">3</div>
                  <div>
                     <h4 className="font-bold text-gray-900 text-sm">Open for Business</h4>
                     <p className="text-[12px] text-gray-500">Finally, call <code className="bg-gray-100 px-1 rounded text-blue-600 font-mono">enableTrading()</code> on Etherscan. Your taxes are now live!</p>
                  </div>
               </div>
            </div>
          </section>

          {/* 4. Pro Tip */}
          <div className="bg-gray-900 rounded-2xl p-6 text-white relative overflow-hidden">
             <Info className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 rotate-12" />
             <h4 className="font-black text-blue-400 uppercase text-[10px] tracking-[0.2em] mb-2">Pro Launch Tip</h4>
             <p className="text-sm font-medium leading-relaxed">
                Always register your official pairs immediately. If you don't, traders might create "Unofficial Pools" to bypass your taxes!
             </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-gray-100 bg-gray-50 text-center">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Build with confidence on TokenLab Protocol</p>
        </div>
      </div>
    </div>
  );
}
