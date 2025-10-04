import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Severity } from '@/types';

interface SeverityChartProps {
  data: Array<{ severity: Severity; count: number }>;
  className?: string;
}

const COLORS = {
  high: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  secure: '#10b981',
};

export const SeverityChart: React.FC<SeverityChartProps> = ({ data, className }) => {
  const chartData = data.map(item => ({
    name: item.severity.toUpperCase(),
    value: item.count,
    color: COLORS[item.severity],
  }));

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [value, 'Findings']}
            labelFormatter={(label) => `Severity: ${label}`}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => <span className="text-sm">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
