/**
 * StatSamarth AI - Frontend Data Definitions
 */

window.STAT_DATA = {
  users: [
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
      department: 'Data Informatics & Innovation Division'
    }
  ],

  competencies: [
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
  ],

  initialUserScores: {
    'usr_iss_001': { comp_01: 4, comp_02: 3, comp_03: 4, comp_04: 5, comp_05: 2, comp_06: 4, comp_07: 2, comp_08: 4, comp_09: 5, comp_10: 3 },
    'usr_iss_002': { comp_01: 4, comp_02: 2, comp_03: 2, comp_04: 2, comp_05: 3, comp_06: 4, comp_07: 3, comp_08: 3, comp_09: 5, comp_10: 3 },
    'usr_iss_003': { comp_01: 2, comp_02: 4, comp_03: 3, comp_04: 2, comp_05: 3, comp_06: 3, comp_07: 3, comp_08: 3, comp_09: 4, comp_10: 2 },
    'usr_iss_004': { comp_01: 3, comp_02: 3, comp_03: 3, comp_04: 4, comp_05: 4, comp_06: 4, comp_07: 3, comp_08: 4, comp_09: 5, comp_10: 3 }
  },

  courses: [
    { id: 'crs_01', title: 'Python for Official Microdata: NSSO Unit-Level Wrangling', provider: 'NSO Training Division (NSSTA)', comp_id: 'comp_05', target: 4, code: 'IGOT-MOSPI-PY-401', mins: 180, rating: 4.9, match: 96 },
    { id: 'crs_02', title: 'CAPI Survey Instrumentation & Real-Time Geo-Tagging', provider: 'Field Operations Division & Karmayogi Bharat', comp_id: 'comp_07', target: 3, code: 'IGOT-FOD-CAPI-302', mins: 120, rating: 4.8, match: 94 },
    { id: 'crs_03', title: 'CPI Concepts, Laspeyres Indexation & Web Portal Scrapers', provider: 'Economic Statistics Division (ESD) & ISTM', comp_id: 'comp_02', target: 4, code: 'IGOT-ESD-CPI-403', mins: 210, rating: 4.9, match: 92 },
    { id: 'crs_04', title: 'System of National Accounts (SNA 2008) & Supply-Use Tables', provider: 'National Accounts Division & RBI Staff College', comp_id: 'comp_04', target: 5, code: 'IGOT-NAD-SNA-504', mins: 300, rating: 5.0, match: 90 },
    { id: 'crs_05', title: 'IIP Base 2011-12 Revision, Factory Frame & Core Industries', provider: 'NSSTA Greater Noida', comp_id: 'comp_03', target: 4, code: 'IGOT-ESD-IIP-405', mins: 150, rating: 4.7, match: 88 },
    { id: 'crs_06', title: 'Collection of Statistics Act 2008 & Data Privacy Governance', provider: 'Institute of Secretariat Training & Management (ISTM)', comp_id: 'comp_09', target: 5, code: 'IGOT-LEG-ACT-506', mins: 90, rating: 4.8, match: 86 }
  ],

  sampleQuizzes: [
    {
      id: 'q1',
      question: 'Under official MoSPI CPI Base 2012 methodology, which mathematical formula is mandated for elementary aggregates at the market/village level across quotations?',
      options: [
        { key: 'A', text: 'Arithmetic Mean of price ratios (Carli formula)' },
        { key: 'B', text: 'Geometric Mean of price relatives (Jevons index formula)' },
        { key: 'C', text: 'Harmonic Mean of relative expenditure shares' },
        { key: 'D', text: 'Median quotation price weighted by population quantiles' }
      ],
      correct: 'B',
      explanation: 'MoSPI officially adopted the Jevons formula (Geometric Mean) for elementary aggregates to eliminate the upward arithmetic substitution bias inherent in the Carli index.',
      citation: {
        manual: 'Consumer Price Index (CPI Base 2012=100) Compilation Guide',
        section: 'Chapter 4: Elementary Aggregates and Price Relatives',
        para: 'Page 34, Paragraph 4.2.1',
        quote: 'Elementary price relatives are aggregated across selected markets within each state using the Geometric Mean (Jevons formula).'
      }
    },
    {
      id: 'q2',
      question: 'In an NSSO rural household survey, if an FSU census village has an estimated population exceeding 1,200 persons, what is the mandatory protocol for Sub-Unit (SU) formation?',
      options: [
        { key: 'A', text: 'Discard the FSU and substitute with an adjacent village' },
        { key: 'B', text: 'Divide into hamlet-groups of equal size and select exactly two (SU 1 purposive, SU 2 random)' },
        { key: 'C', text: 'Survey all households without sub-division' },
        { key: 'D', text: 'Only enumerate households located on the village perimeter' }
      ],
      correct: 'B',
      explanation: 'When population exceeds 1,200 in rural FSUs, division into hamlet-groups is strictly enforced. Exactly two sub-units are selected: SU 1 (with maximum population) and SU 2 (by SRSWOR).',
      citation: {
        manual: 'NSSO 80th Round Household Survey Operations & Sampling Design Manual',
        section: 'Chapter 3: Formation of Sub-Units (SUs) and Hamlet-Groups',
        para: 'Page 31, Section 3.4',
        quote: 'Two sub-units are selected: SU 1 (with maximum population) and SU 2 (randomly selected from remaining).'
      }
    },
    {
      id: 'q3',
      question: 'Which sector carries the single highest individual weighting in India’s Index of Eight Core Industries (Base 2011-12)?',
      options: [
        { key: 'A', text: 'Refinery Products (28.04% within Core Index)' },
        { key: 'B', text: 'Electricity Generation (19.85%)' },
        { key: 'C', text: 'Steel Production (17.92%)' },
        { key: 'D', text: 'Coal Mining (10.33%)' }
      ],
      correct: 'A',
      explanation: 'Refinery Products holds the highest weight in the Eight Core Industries (28.04%), which altogether comprise 40.27% of the total IIP.',
      citation: {
        manual: 'Index of Industrial Production (IIP Base 2011-12) Compilation Manual',
        section: 'Chapter 4: Eight Core Industries Index',
        para: 'Page 28, Section 4.3',
        quote: 'Refinery Products carries the highest individual weight (28.04% within core industries), followed by Electricity (19.85%).'
      }
    }
  ],

  manuals: [
    { id: 'mat_01', title: 'NSSO 80th Round Household Survey Operations & Sampling Design Manual', category: 'Sampling & Field Methods', pages: 148, size: '4.2 MB', ns: 'nsso-survey-80' },
    { id: 'mat_02', title: 'Consumer Price Index (CPI Base 2012=100) Methodology & Compilation Guide', category: 'Price Statistics', pages: 96, size: '3.1 MB', ns: 'cpi-methodology-2012' },
    { id: 'mat_03', title: 'Index of Industrial Production (IIP Base 2011-12) Compilation Manual', category: 'Industrial Statistics', pages: 72, size: '2.8 MB', ns: 'iip-base-2011-12' },
    { id: 'mat_04', title: 'National Accounts Statistics: Sources and Methods (Gross Value Added & SUT)', category: 'Macroeconomic Aggregates', pages: 220, size: '5.6 MB', ns: 'nas-sources-methods' }
  ]
};
