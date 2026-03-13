export default function Workspace() {
  return (
    <div className="flex-1 bg-[#EEF2F5] relative overflow-hidden" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur rounded-md px-3 py-1.5 text-xs font-semibold text-gray-500 shadow-sm border border-gray-200">
        Workspace (Blockly Placeholder)
      </div>
      
      {/* Mocking a Blockly stack visually */}
      <div className="absolute top-20 left-20">
        {/* WHEN BUY */}
        <div className="bg-blue-500 w-64 h-12 rounded-t-xl rounded-b px-4 flex items-center text-white font-bold shadow-md relative z-30">
          ⚡ WHEN BUY
          <div className="absolute -bottom-3 left-4 w-8 h-3 bg-blue-500 clip-path-notch"></div>
        </div>
        
        {/* TAX */}
        <div className="bg-orange-500 w-64 pt-3 pb-8 rounded-b px-4 mt-[-4px] shadow-md relative z-20 flex flex-col gap-2">
          <div className="text-white font-bold flex items-center justify-between">
            <span>💰 TAX</span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-sm">10 %</span>
          </div>
          
          {/* SPLIT Inside Tax */}
          <div className="bg-yellow-500 w-[90%] ml-auto pt-3 pb-4 rounded px-3 shadow-inner relative mt-2 flex flex-col gap-1">
            <div className="text-yellow-900 font-bold mb-1">🔀 SPLIT</div>
            
            {/* Inner actions */}
            <div className="bg-green-500 w-[95%] ml-auto h-8 rounded flex items-center px-2 text-white font-bold text-sm shadow-sm">
              💧 LIQUIDITY <span className="ml-auto bg-black/20 px-1.5 rounded">4%</span>
            </div>
            <div className="bg-purple-500 w-[95%] ml-auto h-8 rounded flex items-center px-2 text-white font-bold text-sm shadow-sm">
              🏦 MARKETING <span className="ml-auto bg-black/20 px-1.5 rounded">3%</span>
            </div>
            <div className="bg-red-500 w-[95%] ml-auto h-8 rounded flex items-center px-2 text-white font-bold text-sm shadow-sm">
              🔥 BURN <span className="ml-auto bg-black/20 px-1.5 rounded">3%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
