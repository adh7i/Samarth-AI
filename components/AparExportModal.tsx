'use client';

import React, { useState, useEffect } from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, Award, FileText } from 'lucide-react';

interface AparExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export const AparExportModal: React.FC<AparExportModalProps> = ({
  isOpen,
  onClose,
  userId = 'usr_iss_001',
}) => {
  const [dossier, setDossier] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch(`/api/v1/admin/export-apar?userId=${userId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setDossier(json.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    if (!dossier) return;
    const blob = new Blob([JSON.stringify(dossier, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dossier.dossier_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slatenavy-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slatecool-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Top Header */}
        <div className="bg-slatenavy-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Award className="w-5 h-5 text-electric-500" />
            <div>
              <h3 className="text-sm font-bold">Official MoSPI e-APAR Competency Dossier</h3>
              <p className="text-[11px] text-slate-300">
                iGOT Karmayogi FRAC Compliance Verification Record
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg bg-slatenavy-800 text-slate-200 hover:text-white transition-colors"
              title="Print Dossier"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownloadJson}
              className="p-1.5 rounded-lg bg-slatenavy-800 text-slate-200 hover:text-white transition-colors"
              title="Download JSON Export"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Dossier Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slatenavy-900 bg-sand-50/20">
          
          {loading || !dossier ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              Generating official APAR dossier...
            </div>
          ) : (
            <div className="bg-white p-6 rounded-xl border border-slatecool-200 shadow-soft space-y-6 print:shadow-none print:border-none">
              
              {/* MoSPI Emblem & Heading */}
              <div className="text-center border-b border-slatecool-200 pb-4">
                <div className="text-2xl mb-1">🏛️</div>
                <h2 className="text-base font-extrabold uppercase tracking-wide text-slatenavy-900">
                  Government of India
                </h2>
                <h3 className="text-xs font-bold text-slatenavy-900/80">
                  Ministry of Statistics and Programme Implementation (MoSPI)
                </h3>
                <div className="text-[10px] font-mono text-slate-500 mt-1">
                  {dossier.dossier_id} • Aligned with {dossier.framework}
                </div>
              </div>

              {/* Officer Bio Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-sand-50 p-4 rounded-xl border border-slatecool-200">
                <div>
                  <span className="text-slate-500 block text-[10px]">Officer Name</span>
                  <span className="font-bold text-slatenavy-900">{dossier.officer_details.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Cadre Role</span>
                  <span className="font-bold text-slatenavy-900">{dossier.officer_details.cadre_role}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Assigned Zone</span>
                  <span className="font-bold text-slatenavy-900">{dossier.officer_details.zone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Official APAR ID</span>
                  <span className="font-mono font-bold text-electric-600">{dossier.officer_details.apar_id}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Division</span>
                  <span className="font-bold text-slatenavy-900">{dossier.officer_details.department}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Skill Readiness Index</span>
                  <span className="font-bold text-emeralddeep-700">{dossier.audit_metrics.skill_readiness_index}</span>
                </div>
              </div>

              {/* Competency Evaluation Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slatenavy-900 mb-2">
                  Verified FRAC Competencies Audit Record
                </h4>
                <div className="border border-slatecool-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slatecool-100 font-bold text-slatenavy-900 text-[10px] uppercase">
                      <tr>
                        <th className="p-2.5">Competency Title</th>
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5 text-center">Req. Level</th>
                        <th className="p-2.5 text-center">Assessed</th>
                        <th className="p-2.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slatecool-200">
                      {dossier.competency_evaluation_matrix.map((c: any, idx: number) => (
                        <tr key={idx} className="hover:bg-sand-50/50">
                          <td className="p-2.5 font-medium text-slatenavy-900">
                            {c.competency_name}
                          </td>
                          <td className="p-2.5 text-slate-500 text-[11px]">
                            {c.category}
                          </td>
                          <td className="p-2.5 text-center font-mono">
                            {c.required_frac_level}
                          </td>
                          <td className="p-2.5 text-center font-mono font-bold text-slatenavy-900">
                            {c.assessed_level}
                          </td>
                          <td className="p-2.5 text-right">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                c.compliance_status === 'VERIFIED'
                                  ? 'bg-emeralddeep-50 text-emeralddeep-700'
                                  : 'bg-crimsonsoft-50 text-crimsonsoft-600'
                              }`}
                            >
                              {c.compliance_status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Digital Signature & MoSPI Stamp */}
              <div className="pt-4 border-t border-slatecool-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-8 h-8 text-emeralddeep-600" />
                  <div>
                    <div className="font-bold text-slatenavy-900">
                      iGOT Karmayogi Bharat Digital Seal
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 break-all">
                      {dossier.digital_signature.hash.slice(0, 48)}...
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-slatenavy-900">
                    {dossier.digital_signature.certifying_officer}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Certified on: {new Date(dossier.generated_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-sand-50 p-4 border-t border-slatecool-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white border border-slatecool-300 text-xs font-semibold text-slate-700 hover:bg-slatecool-50"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-electric-500 text-white text-xs font-bold hover:bg-electric-600 transition-colors flex items-center space-x-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Dossier</span>
          </button>
        </div>

      </div>
    </div>
  );
};
