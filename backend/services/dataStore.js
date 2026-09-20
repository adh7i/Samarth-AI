/**
 * StatSamarth AI - MoSPI Backend Data Store
 */

class DataStore {
  constructor() {
    this.users = [
      {
        id: 'usr_iss_001',
        name: 'Dr. Rajeshwar Sharma, ISS',
        email: 'rajeshwar.sharma@mospi.gov.in',
        role_title: 'Senior Statistical Officer (ISS)',
        zone: 'North Zone - New Delhi',
        apar_id: 'APAR-2025-ISS-8842',
        department: 'National Accounts Division (NAD)'
      },
      {
        id: 'usr_iss_002',
        name: 'Pooja Varma, ISS',
        email: 'pooja.varma@mospi.gov.in',
        role_title: 'Sub-Assistant Director (FOD NSSO)',
        zone: 'East Zone - Kolkata',
        apar_id: 'APAR-2025-ISS-9120',
        department: 'Field Operations Division (FOD), NSSO'
      },
      {
        id: 'usr_iss_003',
        name: 'Ananthakrishnan K., SSS',
        email: 'k.ananthakrishnan@mospi.gov.in',
        role_title: 'Junior Statistical Officer (ESD)',
        zone: 'South Zone - Bengaluru',
        apar_id: 'APAR-2025-SSS-4401',
        department: 'Economic Statistics Division (ESD - CPI/IIP)'
      },
      {
        id: 'usr_iss_004',
        name: 'Sunita Deshmukh',
        email: 'sunita.deshmukh@mospi.gov.in',
        role_title: 'Joint Director (DIID)',
        zone: 'West Zone - Mumbai',
        apar_id: 'APAR-2025-ISS-3211',
        department: 'Data Informatics and Innovation Division'
      }
    ];

    this.competencies = [
      { id: 'comp_01', name: 'Sampling Design & NSSO Survey Methodologies', category: 'Domain', required: 4, desc: 'Multi-stage stratified sampling, FSU selection, and circular systematic sampling.' },
      { id: 'comp_02', name: 'CPI Laspeyres Indexation & Price Relatives', category: 'Domain', required: 4, desc: 'Base 2012=100 index formulation, Jevons geometric mean, and overlap pricing.' },
      { id: 'comp_03', name: 'IIP Base 2011-12 Compilation & Core Weights', category: 'Domain', required: 4, desc: 'Factory sector ASI frame, Eight Core Industries weighting (40.27%), and deflation.' },
      { id: 'comp_04', name: 'National Accounts Statistics & GVA Estimation', category: 'Domain', required: 5, desc: 'SNA 2008 standards, GVA at basic prices, FISIM distribution, and Supply-Use Tables.' },
      { id: 'comp_05', name: 'Python & R for Official Microdata Analytics', category: 'Technical', required: 4, desc: 'Automated survey data pipelines, pandas wrangling, and survey multipliers.' },
      { id: 'comp_06', name: 'Data Quality Audit & Non-Sampling Errors', category: 'Technical', required: 4, desc: 'Outlier detection, item non-response imputations, and variance controls.' },
      { id: 'comp_07', name: 'CAPI / Modern Digital Survey Instruments', category: 'Technical', required: 3, desc: 'CAPI tablet deployment, GPS geo-tagging, and offline validation scripts.' },
      { id: 'comp_08', name: 'Statistical Evidence & Policy Formulation', category: 'Behavioral', required: 4, desc: 'Translating complex macro indicators into parliamentary statistical briefs.' },
      { id: 'comp_09', name: 'Ethical Data Governance & Statistics Act', category: 'Behavioral', required: 5, desc: 'Collection of Statistics Act 2008, confidentiality, and UN Fundamental Principles.' },
      { id: 'comp_10', name: 'Inter-Departmental Coordination & Mentorship', category: 'Behavioral', required: 3, desc: 'Collaboration with State DES and training field enumerators.' }
    ];

    this.userScores = {
      'usr_iss_001': { comp_01: 4, comp_02: 3, comp_03: 4, comp_04: 5, comp_05: 2, comp_06: 4, comp_07: 2, comp_08: 4, comp_09: 5, comp_10: 3 },
      'usr_iss_002': { comp_01: 4, comp_02: 2, comp_03: 2, comp_04: 2, comp_05: 3, comp_06: 4, comp_07: 3, comp_08: 3, comp_09: 5, comp_10: 3 },
      'usr_iss_003': { comp_01: 2, comp_02: 4, comp_03: 3, comp_04: 2, comp_05: 3, comp_06: 3, comp_07: 3, comp_08: 3, comp_09: 4, comp_10: 2 },
      'usr_iss_004': { comp_01: 3, comp_02: 3, comp_03: 3, comp_04: 4, comp_05: 4, comp_06: 4, comp_07: 3, comp_08: 4, comp_09: 5, comp_10: 3 }
    };

    this.courses = [
      { id: 'crs_01', title: 'Python for Official Microdata: NSSO Unit-Level Wrangling', provider: 'NSO Training Division (NSSTA)', comp_id: 'comp_05', target: 4, code: 'IGOT-MOSPI-PY-401', mins: 180, rating: 4.9, match: 96 },
      { id: 'crs_02', title: 'CAPI Survey Instrumentation & Real-Time Geo-Tagging', provider: 'Field Operations Division & Karmayogi Bharat', comp_id: 'comp_07', target: 3, code: 'IGOT-FOD-CAPI-302', mins: 120, rating: 4.8, match: 94 },
      { id: 'crs_03', title: 'CPI Concepts, Laspeyres Indexation & Web Portal Scrapers', provider: 'Economic Statistics Division (ESD) & ISTM', comp_id: 'comp_02', target: 4, code: 'IGOT-ESD-CPI-403', mins: 210, rating: 4.9, match: 92 },
      { id: 'crs_04', title: 'System of National Accounts (SNA 2008) & Supply-Use Tables', provider: 'National Accounts Division & RBI Staff College', comp_id: 'comp_04', target: 5, code: 'IGOT-NAD-SNA-504', mins: 300, rating: 5.0, match: 90 },
      { id: 'crs_05', title: 'IIP Base 2011-12 Revision, Factory Frame & Core Industries', provider: 'NSSTA Greater Noida', comp_id: 'comp_03', target: 4, code: 'IGOT-ESD-IIP-405', mins: 150, rating: 4.7, match: 88 },
      { id: 'crs_06', title: 'Collection of Statistics Act 2008 & Data Privacy Governance', provider: 'Institute of Secretariat Training & Management (ISTM)', comp_id: 'comp_09', target: 5, code: 'IGOT-LEG-ACT-506', mins: 90, rating: 4.8, match: 86 }
    ];

    this.materials = [
      { id: 'mat_01', title: 'NSSO 80th Round Household Survey Operations & Sampling Design Manual', category: 'Sampling & Field Methods', pages: 148, size: '4.2 MB', vector_namespace: 'nsso-survey-80' },
      { id: 'mat_02', title: 'Consumer Price Index (CPI Base 2012=100) Methodology & Compilation Guide', category: 'Price Statistics', pages: 96, size: '3.1 MB', vector_namespace: 'cpi-methodology-2012' },
      { id: 'mat_03', title: 'Index of Industrial Production (IIP Base 2011-12) Compilation Manual', category: 'Industrial Statistics', pages: 72, size: '2.8 MB', vector_namespace: 'iip-base-2011-12' },
      { id: 'mat_04', title: 'National Accounts Statistics: Sources and Methods (Gross Value Added & SUT)', category: 'Macroeconomic Aggregates', pages: 220, size: '5.6 MB', vector_namespace: 'nas-sources-methods' }
    ];

    this.aparStatus = {
      'usr_iss_001': { synced: false, last_sync: '2025-01-20T10:00:00Z', hash: '0x8fbc72a19e34c990b7e2129e9841' },
      'usr_iss_002': { synced: true, last_sync: '2025-02-15T18:30:00Z', hash: '0x3adc9102b4491efa91845112df88' }
    };
  }

  getUser(userId) {
    return this.users.find(u => u.id === userId) || this.users[0];
  }

  getProfile(userId) {
    const user = this.getUser(userId);
    const scores = this.userScores[user.id] || {};
    let totalReq = 0;
    let totalAchieved = 0;
    let verifiedCount = 0;

    const gaps = this.competencies.map(comp => {
      const cur = scores[comp.id] || 1;
      const req = comp.required;
      const gap = Math.max(0, req - cur);
      const isVerified = cur >= req;
      if (isVerified) verifiedCount++;
      totalReq += req;
      totalAchieved += Math.min(cur, req);
      return {
        competency_id: comp.id,
        competency_name: comp.name,
        category: comp.category,
        required_level: req,
        current_level: cur,
        gap,
        status: isVerified ? 'VERIFIED' : 'GAP_IDENTIFIED',
        readiness_percentage: Math.round((Math.min(cur, req) / req) * 100)
      };
    });

    const readiness_index = totalReq > 0 ? Math.round((totalAchieved / totalReq) * 100) : 0;
    const apar = this.aparStatus[user.id] || { synced: false, last_sync: null, hash: '' };

    return {
      user,
      readiness_index,
      total_competencies: this.competencies.length,
      verified_competencies: verifiedCount,
      gap_count: this.competencies.length - verifiedCount,
      radar_data: this.competencies.map(c => ({
        competency: c.name.length > 22 ? c.name.slice(0, 20) + '…' : c.name,
        current: scores[c.id] || 1,
        required: c.required,
        category: c.category
      })),
      gaps,
      apar_status: {
        synced: apar.synced,
        last_sync: apar.last_sync,
        apar_id: user.apar_id,
        pending_updates: this.competencies.length - verifiedCount
      }
    };
  }

  upgradeCompetency(userId, compId) {
    if (!this.userScores[userId]) this.userScores[userId] = {};
    const cur = this.userScores[userId][compId] || 1;
    const next = Math.min(5, cur + 1);
    this.userScores[userId][compId] = next;
    if (this.aparStatus[userId]) {
      this.aparStatus[userId].synced = false;
    }
    return next;
  }

  syncApar(userId) {
    const user = this.getUser(userId);
    const hash = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const ts = new Date().toISOString();
    this.aparStatus[user.id] = { synced: true, last_sync: ts, hash };
    return {
      success: true,
      apar_id: user.apar_id,
      synced_at: ts,
      transaction_hash: hash,
      message: `Synchronized verified FRAC skills for ${user.name} to iGOT Passbook.`
    };
  }
}

module.exports = new DataStore();
