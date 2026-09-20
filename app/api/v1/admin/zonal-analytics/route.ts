import { NextResponse } from 'next/server';
import { db } from '@/lib/db/database';

export async function GET() {
  try {
    const zonalData = db.getZonalAnalytics();
    const competencies = db.getCompetencies();

    // Generate Cadre & Competency Gap Heatmap data
    const heatmap = competencies.map(comp => {
      return {
        competency_name: comp.competency_name,
        category: comp.category,
        iss_cadre_gap: Number((Math.random() * 1.5 + 0.5).toFixed(1)),
        sss_cadre_gap: Number((Math.random() * 2.0 + 1.0).toFixed(1)),
        field_staff_gap: Number((Math.random() * 2.5 + 1.2).toFixed(1)),
        urgency: comp.required_level >= 4 ? 'HIGH' : 'MEDIUM'
      };
    });

    const totalOfficers = zonalData.reduce((acc, z) => acc + z.officers_count, 0);
    const nationalAvgReadiness = Math.round(
      zonalData.reduce((acc, z) => acc + z.avg_readiness_index * z.officers_count, 0) / totalOfficers
    );

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          total_officers: totalOfficers,
          national_avg_readiness: nationalAvgReadiness,
          target_readiness: 85.0,
          pending_apar_sync: 184
        },
        zones: zonalData,
        competency_heatmap: heatmap
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch zonal analytics' },
      { status: 500 }
    );
  }
}
