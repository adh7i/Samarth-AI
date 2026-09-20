'use client';

import React, { useState, useEffect } from 'react';
import { ZonalCapacityData } from '@/lib/types';
import { MapPin, Users, TrendingUp, AlertTriangle, Download, Award, ShieldCheck } from 'lucide-react';

interface ZonalHeatmapProps {
  onOpenAparExport: () => void;
}

export const ZonalHeatmap: React.FC<ZonalHeatmapProps> = ({ onOpenAparExport }) => {
  const [data, setData] = useState<{
    summary: any;
    zones: ZonalCapacityData[];
    competency_heatmap: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/admin/zonal-analytics')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setData(json.data);
        }
      })
      .catch((err) => console.error('Zonal analytics fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="bg-white rounded-xl p-8 border border-slatecool-200 text-center text-xs text-slate-500">
        Loading MoSPI Zonal Analytics...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* National Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-xl p-4 border border-slatecool-200 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Total MoSPI Cadre</span>
            <Users className="w-4 h-4 text-electric-500" />
          </div>
          <div className="text-2xl font-extrabold text-slatenavy-900">
            {data.summary.total_officers}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            ISS, SSS & FOD Field Staff
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slatecool-200 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>National Avg Readiness</span>
            <TrendingUp className="w-4 h-4 text-emeralddeep-600" />
          </div>
          <div className="text-2xl font-extrabold text-emeralddeep-600">
            {data.summary.national_avg_readiness}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Target Benchmark: {data.summary.target_readiness}%
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slatecool-200 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
            <span>Pending APAR Sync</span>
            <AlertTriangle className="w-4 h-4 text-crimsonsoft-600" />
          </div>
          <div className="text-2xl font-extrabold text-crimsonsoft-600">
            {data.summary.pending_apar_sync}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Officers with unlinked assessments
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slatecool-200 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
              <span>Official APAR Export</span>
              <Award className="w-4 h-4 text-slatenavy-900" />
            </div>
            <div className="text-xs text-slatenavy-900 font-medium">
              MoSPI Competency Audit Dossier
            </div>
          </div>
          <button
            onClick={onOpenAparExport}
            className="mt-2 w-full py-1.5 px-3 rounded-lg bg-slatenavy-900 text-white text-xs font-bold hover:bg-slatenavy-800 transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate Dossier</span>
          </button>
        </div>

      </div>

      {/* Regional Zone Capacity Breakdown */}
      <div className="bg-white rounded-xl border border-slatecool-200 p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slatenavy-900 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-electric-500" />
              <span>Zonal Capacity & Competency Index (North, East, South, West, Central)</span>
            </h3>
            <p className="text-xs text-slatenavy-900/60 mt-0.5">
              Regional training division performance metrics and priority skill gaps
            </p>
          </div>
          <span className="text-xs font-bold text-electric-600 bg-electric-50 px-2.5 py-1 rounded-full border border-electric-200">
            5 MoSPI Zones Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.zones.map((zone) => (
            <div
              key={zone.zone}
              className="p-4 rounded-xl border border-slatecool-200 bg-sand-50/40 hover:bg-white hover:border-electric-500 transition-all shadow-soft"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slatenavy-900">
                    {zone.zone}
                  </h4>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    HQ: {zone.headquarters}
                  </div>
                </div>
                <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded border border-slatecool-200 text-slatenavy-900">
                  {zone.officers_count} Officers
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600">Readiness Score</span>
                  <span className="font-bold text-slatenavy-900">{zone.avg_readiness_index}%</span>
                </div>
                <div className="h-2 w-full bg-slatecool-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      zone.avg_readiness_index >= 80 ? 'bg-emeralddeep-600' : 'bg-electric-500'
                    }`}
                    style={{ width: `${zone.avg_readiness_index}%` }}
                  />
                </div>
              </div>

              {/* Top Gap Competency */}
              <div className="mt-4 pt-3 border-t border-slatecool-200 text-xs">
                <span className="text-slate-500 block text-[11px]">Primary Regional Training Gap:</span>
                <span className="font-bold text-crimsonsoft-600 mt-0.5 block">
                  ⚠️ {zone.top_gap_competency}
                </span>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                  <span>APAR Sync Rate:</span>
                  <span className="font-bold text-slatenavy-900">{zone.apar_sync_rate}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cadre vs Competency Gap Heatmap Matrix */}
      <div className="bg-white rounded-xl border border-slatecool-200 p-6 shadow-card">
        <h3 className="text-base font-bold text-slatenavy-900 mb-1">
          MoSPI Organizational Competency Gap Heatmap
        </h3>
        <p className="text-xs text-slatenavy-900/60 mb-4">
          Visual matrix comparing skill deficits across Indian Statistical Service (ISS), SSS, and Field Enumerators
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slatecool-100/80 text-slatenavy-900 font-bold border-b border-slatecool-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">FRAC Competency</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">ISS Officers Gap</th>
                <th className="py-3 px-4 text-center">SSS Cadre Gap</th>
                <th className="py-3 px-4 text-center">Field Staff Gap</th>
                <th className="py-3 px-4 text-center">Intervention Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slatecool-200">
              {data.competency_heatmap.map((item, idx) => (
                <tr key={idx} className="hover:bg-sand-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slatenavy-900">
                    {item.competency_name}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {item.category}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded text-xs font-bold ${
                        item.iss_cadre_gap >= 1.5
                          ? 'bg-crimsonsoft-100 text-crimsonsoft-700'
                          : item.iss_cadre_gap >= 1.0
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emeralddeep-50 text-emeralddeep-700'
                      }`}
                    >
                      -{item.iss_cadre_gap} Lvl
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded text-xs font-bold ${
                        item.sss_cadre_gap >= 1.8
                          ? 'bg-crimsonsoft-100 text-crimsonsoft-700'
                          : item.sss_cadre_gap >= 1.2
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emeralddeep-50 text-emeralddeep-700'
                      }`}
                    >
                      -{item.sss_cadre_gap} Lvl
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded text-xs font-bold ${
                        item.field_staff_gap >= 2.0
                          ? 'bg-crimsonsoft-100 text-crimsonsoft-700'
                          : item.field_staff_gap >= 1.4
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emeralddeep-50 text-emeralddeep-700'
                      }`}
                    >
                      -{item.field_staff_gap} Lvl
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        item.urgency === 'HIGH'
                          ? 'bg-crimsonsoft-50 text-crimsonsoft-600 border border-crimsonsoft-200'
                          : 'bg-electric-50 text-electric-600 border border-electric-200'
                      }`}
                    >
                      {item.urgency}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
