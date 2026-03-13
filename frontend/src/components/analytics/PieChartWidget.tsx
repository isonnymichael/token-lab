import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

interface PieChartWidgetProps {
  activeEvent: any;
  taxRate: number;
  displayData: { name: string; value: number; color: string }[];
  chartData: { name: string; value: number; color: string }[];
}

export default function PieChartWidget({ activeEvent, taxRate, displayData, chartData }: PieChartWidgetProps) {
  return (
    <div className="p-5 border-b border-gray-100">
      <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 text-center">
        {activeEvent ? `Tax Breakdown (${taxRate}%)` : 'No Tax Configured'}
      </h3>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={displayData}
              innerRadius={50}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {displayData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <RechartsTooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#374151', fontWeight: 'bold' }}
              cursor={false}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 mt-2">
        {chartData.map(d => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></div>
            {d.name} ({d.value}%)
          </div>
        ))}
      </div>
    </div>
  );
}
