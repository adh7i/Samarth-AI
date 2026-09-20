'use client';

import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
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

export const CompetencyRadar: React.FC<CompetencyRadarProps> = ({ data }) => {
  return (
    <div className="w-full h-[380px] flex flex-col justify-center items-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#E2E8F0" strokeDasharray="3 3" />
          
          <PolarAngleAxis
            dataKey="competency"
            tick={{ fill: '#0F172A', fontSize: 11, fontWeight: 600 }}
          />

          <PolarRadiusAxis
            angle={30}
            domain={[0, 5]}
            tickCount={6}
            tick={{ fill: '#64748B', fontSize: 10 }}
          />

          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-slatenavy-900 text-white p-3 rounded-lg shadow-xl border border-slatenavy-800 text-xs">
                    <div className="font-bold text-sm mb-1 text-electric-500">{item.competency}</div>
                    <div className="text-[11px] text-slate-300 mb-2">Category: {item.category}</div>
                    <div className="flex items-center justify-between space-x-4 mb-1">
                      <span className="text-slate-300">Current Level:</span>
                      <span className="font-bold text-electric-500">Level {item.current} / 5</span>
                    </div>
                    <div className="flex items-center justify-between space-x-4">
                      <span className="text-slate-300">Required FRAC Benchmark:</span>
                      <span className="font-bold text-slate-200">Level {item.required} / 5</span>
                    </div>
                    {item.current < item.required && (
                      <div className="mt-2 pt-1 border-t border-slate-700 text-crimsonsoft-500 font-semibold">
                        Gap Delta: -{item.required - item.current} Level(s)
                      </div>
                    )}
                    {item.current >= item.required && (
                      <div className="mt-2 pt-1 border-t border-slate-700 text-emeralddeep-500 font-semibold">
                        ✓ Benchmark Met & Verified
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />

          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{ fontSize: '12px', fontWeight: 600 }}
          />

          <Radar
            name="Current Assessed Level"
            dataKey="current"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.45}
            strokeWidth={2.5}
          />

          <Radar
            name="Required FRAC Level"
            dataKey="required"
            stroke="#0F172A"
            fill="#0F172A"
            fillOpacity={0.1}
            strokeWidth={2}
            strokeDasharray="4 4"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
