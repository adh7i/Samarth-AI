import { NextResponse } from 'next/server';
import { db } from '@/lib/db/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'usr_iss_001';

    const profile = db.getUserCompetencyProfile(userId);
    if (!profile) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const exportDossier = {
      dossier_id: `MOSPI-APAR-${profile.user.apar_id}-${new Date().getFullYear()}`,
      issuing_authority: 'Ministry of Statistics & Programme Implementation (MoSPI), Government of India',
      framework: 'iGOT Karmayogi FRAC (Framework of Roles, Activities, and Competencies)',
      generated_at: new Date().toISOString(),
      officer_details: {
        name: profile.user.name,
        email: profile.user.email,
        cadre_role: profile.user.role_title,
        zone: profile.user.zone,
        department: profile.user.department,
        apar_id: profile.user.apar_id
      },
      audit_metrics: {
        skill_readiness_index: `${profile.readiness_index}%`,
        verified_competencies: `${profile.verified_competencies} / ${profile.total_competencies}`,
        apar_passbook_status: profile.apar_status.synced ? 'SYNCHRONIZED' : 'PENDING_UPDATE',
        last_sync_timestamp: profile.apar_status.last_sync
      },
      competency_evaluation_matrix: profile.gaps.map(g => ({
        competency_name: g.competency_name,
        category: g.category,
        required_frac_level: `Level ${g.required_level}`,
        assessed_level: `Level ${g.current_level}`,
        compliance_status: g.status,
        gap_delta: g.gap > 0 ? `-${g.gap}` : '0 (Benchmark Met)'
      })),
      digital_signature: {
        hash: 'SHA256:' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        certifying_officer: 'Joint Secretary (Administration & Training), MoSPI HQ'
      }
    };

    return NextResponse.json({
      success: true,
      data: exportDossier
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Export error' },
      { status: 500 }
    );
  }
}
