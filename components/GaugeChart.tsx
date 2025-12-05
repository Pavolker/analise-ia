import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface GaugeChartProps {
  value: number; // 0 to 100
}

const GaugeChart: React.FC<GaugeChartProps> = ({ value }) => {
  const data = [
    { name: 'Score', value: value },
    { name: 'Remaining', value: 100 - value },
  ];

  // Determine color based on AI probability
  // Low AI (Green) -> High AI (Red/Purple)
  let color = '#22c55e'; // Green
  if (value > 30) color = '#eab308'; // Yellow
  if (value > 60) color = '#f97316'; // Orange
  if (value > 85) color = '#ec4899'; // Pink/Purple (High AI)

  const cx = "50%";
  const cy = "75%"; // Push center down to make it a half-circle
  const iR = 60;
  const oR = 80;

  return (
    <div className="flex flex-col items-center justify-center relative w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              dataKey="value"
              startAngle={180}
              endAngle={0}
              data={data}
              cx={cx}
              cy={cy}
              innerRadius={iR}
              outerRadius={oR}
              stroke="none"
              paddingAngle={0}
            >
              <Cell key="score" fill={color} cornerRadius={6} />
              <Cell key="remaining" fill="#334155" /> 
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Needle/Value Display */}
        <div className="absolute bottom-6 flex flex-col items-center">
            <span className="text-4xl font-bold text-white tracking-tighter">
                {value}%
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-widest mt-1">
                Probabilidade IA
            </span>
        </div>
    </div>
  );
};

export default GaugeChart;