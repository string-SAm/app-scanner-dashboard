import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Section } from '@/types';

interface SectionChartProps {
  data: Array<{ section: Section; count: number }>;
  className?: string;
}

const COLORS = {
  certificate: '#ef4444',
  manifest: '#f59e0b',
  code: '#3b82f6',
  permissions: '#8b5cf6',
  trackers: '#ec4899',
  secrets: '#10b981',
  firebase: '#f97316',
};

export const SectionChart: React.FC<SectionChartProps> = ({ data, className }) => {
  const chartData = data.map(item => ({
    name: item.section.toUpperCase(),
    value: item.count,
    color: COLORS[item.section],
  }));

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value: number) => [value, 'Findings']}
            labelFormatter={(label) => `Section: ${label}`}
          />
          <Bar 
            dataKey="value" 
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};