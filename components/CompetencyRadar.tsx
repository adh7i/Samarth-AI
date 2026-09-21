'use client';

import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface RadarDataPoint {
  competency: string;
  current: number;
  required: number;
  category: string;
  fullMark: number;
}

interface CompetencyRadarProps {
  data: RadarDataPoint[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slatenavy-900 text-white p-3 rounded-lg shadow-xl border border-slatenavy-800 text-xs">
        <div className="font-bold text-sm mb-1 text-electric-500">{data.competency}</div>
        <div className="text-[11px] text-slate-300 mb-2">Category: {data.category}</div>
        
        <div className="flex items-center justify-between space-x-4 mb-1">
          <span className="text-slate-300">Current Level:</span>
          <span className="font-bold text-electric-500">Level {data.current} / {data.fullMark}</span>
        </div>
        
        <div className="flex items-center justify-between space-x-4">
          <span className="text-slate-300">Required FRAC Benchmark:</span>
          <span className="font-bold text-slate-200">Level {data.required} / {data.fullMark}</span>
        </div>

        {data.current < data.required && (
          <div className="mt-2 pt-1 border-t border-slate-700 text-crimsonsoft-500 font-semibold">
            Gap Delta: -{data.required - data.current} Level(s)
          </div>
        )}
        
        {data.current >= data.required && (
          <div className="mt-2 pt-1 border-t border-slate-700 text-emeralddeep-500 font-semibold">
            ✓ Benchmark Met & Verified
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const CompetencyRadar: React.FC<CompetencyRadarProps> = ({ data }) => {
  return (
    <div className="w-full h-[380px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#E2E8F0" />
          <PolarAngleAxis 
            dataKey="competency" 
            tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 5]} 
            tick={{ fill: '#94A3B8', fontSize: 10 }}
            tickCount={6}
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="Required Benchmark"
            dataKey="required"
            stroke="#94A3B8"
            fill="#CBD5E1"
            fillOpacity={0.2}
            strokeDasharray="3 3"
          />
          <Radar
            name="Current Level"
            dataKey="current"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
