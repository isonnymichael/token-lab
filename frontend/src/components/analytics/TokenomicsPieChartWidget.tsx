import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import type { Allocation } from '../../context/AppContext';

interface TokenomicsPieChartWidgetProps {
  allocations: Allocation[];
  totalSupply: number;
}

export default function TokenomicsPieChartWidget({ allocations, totalSupply }: TokenomicsPieChartWidgetProps) {
  // Only show allocations that have a positive percentage
  const chartData = allocations.filter(a => a.percentage > 0).map(a => ({
    name: a.name,
    value: a.percentage,
    color: a.color,
    rawAmount: (totalSupply * a.percentage) / 100
  }));

  const totalAllocated = chartData.reduce((sum, item) => sum + item.value, 0);
  const isComplete = totalAllocated === 100;

  // Add an 'Unallocated' slice if under 100%
  const displayData = isComplete ? chartData : [
    ...chartData,
    { name: 'Unallocated', value: 100 - totalAllocated, color: '#f1f5f9', rawAmount: (totalSupply * (100 - totalAllocated)) / 100 }
  ];

  return (
    <div className="p-5 border-b border-gray-100 bg-white">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xs font-bold text-gray-400 uppercase">Tokenomics Distribution</h3>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isComplete ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {totalAllocated}% Allocated
        </span>
      </div>
      
      <div className="h-56 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={displayData}
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={500}
            >
              {displayData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <RechartsTooltip
              formatter={(value: any, name: any, props: any) => [
                `${value}% (${props.payload.rawAmount.toLocaleString()})`,
                name
              ]}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#374151', fontWeight: 'bold' }}
              cursor={false}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Supply</span>
          <span className="text-sm font-bold text-gray-700 -mt-1">
            {totalSupply.toLocaleString(undefined, { notation: 'compact', maximumFractionDigits: 1 })}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 mt-4">
        {chartData.map(d => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: d.color }}></div>
            <span className="truncate max-w-[100px]" title={d.name}>{d.name}</span>
            <span className="font-bold text-gray-800 ml-auto">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
