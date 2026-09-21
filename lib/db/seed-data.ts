import { User, FracCompetency, UserCompetencyScore, IGotCourse, LearningMaterial, Quiz } from '../types';

export const SEED_USERS: User[] = [];

export const SEED_COMPETENCIES: FracCompetency[] = [
  {
    id: 'comp_01',
    competency_name: 'Sampling Design & NSSO Survey Methodologies',
    category: 'Domain',
    required_level: 4,
    description: 'Mastery over multi-stage stratified sampling, circular systematic sampling, selection of First Stage Units (FSUs), and sampling weight calibration.',
    code: 'FRAC-DOM-SMPL-01'
  },
  {
    id: 'comp_02',
    competency_name: 'CPI Laspeyres Indexation & Price Relatives',
    category: 'Domain',
    required_level: 4,
    description: 'Formulation of base 2012=100 consumer price indices, geometric mean calculation of price relatives, imputations for non-responses, and chained index numbers.',
    code: 'FRAC-DOM-CPI-02'
  },
  {
    id: 'comp_03',
    competency_name: 'IIP Base 2011-12 Compilation & Core Sector Weighting',
    category: 'Domain',
    required_level: 4,
    description: 'Understanding factory sector coverage, eight core industries weighting matrix, item basket selection, and seasonal adjustment methodologies.',
    code: 'FRAC-DOM-IIP-03'
  },
  {
    id: 'comp_04',
    competency_name: 'National Accounts Statistics & GVA Estimation',
    category: 'Domain',
    required_level: 5,
    description: 'System of National Accounts (SNA 2008), Gross Value Added by economic activity, FISIM distribution, Supply-Use Tables (SUT), and deflator estimation.',
    code: 'FRAC-DOM-NAS-04'
  },
  {
    id: 'comp_05',
    competency_name: 'Python & R for Official Microdata Analytics',
    category: 'Technical',
    required_level: 4,
    description: 'Advanced data wrangling on large NSSO unit-level data files, pandas/polars pipeline development, survey weights weighting vectors, and automated validation.',
    code: 'FRAC-TECH-PYR-05'
  },
  {
    id: 'comp_06',
    competency_name: 'Data Quality Audit & Non-Sampling Error Reduction',
    category: 'Technical',
    required_level: 4,
    description: 'Auditing field enumerator responses, outlier detection rules, item non-response imputation techniques, and post-stratification variance controls.',
    code: 'FRAC-TECH-DQA-06'
  },
  {
    id: 'comp_07',
    competency_name: 'CAPI / Modern Digital Survey Instruments',
    category: 'Technical',
    required_level: 3,
    description: 'Deployment and real-time syncing of Computer Assisted Personal Interviewing (CAPI) tablets, GPS geo-tagging of sample households, and offline validation scripts.',
    code: 'FRAC-TECH-CAPI-07'
  },
  {
    id: 'comp_08',
    competency_name: 'Statistical Evidence & Policy Formulation',
    category: 'Behavioral',
    required_level: 4,
    description: 'Translating complex macro-economic indicators into executive policy notes, ministry briefings, and parliamentary statistical replies with clarity.',
    code: 'FRAC-BEH-EVP-08'
  },
  {
    id: 'comp_09',
    competency_name: 'Ethical Data Governance & Official Statistics Act',
    category: 'Behavioral',
    required_level: 5,
    description: 'Strict adherence to the Collection of Statistics Act 2008, statistical confidentiality protocols, respondent privacy safeguarding, and UN Fundamental Principles.',
    code: 'FRAC-BEH-GOV-09'
  },
  {
    id: 'comp_10',
    competency_name: 'Inter-Departmental Coordination & Capacity Mentorship',
    category: 'Behavioral',
    required_level: 3,
    description: 'Collaborating with State DES (Directorates of Economics and Statistics) and training junior field enumerators on standardized MoSPI protocols.',
    code: 'FRAC-BEH-CRD-10'
  }
];

export const SEED_USER_SCORES: UserCompetencyScore[] = [
  // Dr. Rajeshwar Sharma (ISS) - Strong in National Accounts and Governance, Gap in Python and CAPI
  { id: 'sc_01', user_id: 'usr_iss_001', competency_id: 'comp_01', current_level: 4, last_assessed_at: '2025-01-15T10:00:00Z' },
  { id: 'sc_02', user_id: 'usr_iss_001', competency_id: 'comp_02', current_level: 3, last_assessed_at: '2024-12-10T14:30:00Z' },
  { id: 'sc_03', user_id: 'usr_iss_001', competency_id: 'comp_03', current_level: 4, last_assessed_at: '2025-02-01T12:00:00Z' },
  { id: 'sc_04', user_id: 'usr_iss_001', competency_id: 'comp_04', current_level: 5, last_assessed_at: '2025-01-20T16:00:00Z' }, // Verified
  { id: 'sc_05', user_id: 'usr_iss_001', competency_id: 'comp_05', current_level: 2, last_assessed_at: '2024-11-15T09:00:00Z' }, // Gap (Req 4, Cur 2)
  { id: 'sc_06', user_id: 'usr_iss_001', competency_id: 'comp_06', current_level: 4, last_assessed_at: '2025-02-12T11:20:00Z' },
  { id: 'sc_07', user_id: 'usr_iss_001', competency_id: 'comp_07', current_level: 2, last_assessed_at: '2024-10-05T15:10:00Z' }, // Gap (Req 3, Cur 2)
  { id: 'sc_08', user_id: 'usr_iss_001', competency_id: 'comp_08', current_level: 4, last_assessed_at: '2025-01-18T10:45:00Z' },
  { id: 'sc_09', user_id: 'usr_iss_001', competency_id: 'comp_09', current_level: 5, last_assessed_at: '2025-02-14T09:30:00Z' }, // Verified
  { id: 'sc_10', user_id: 'usr_iss_001', competency_id: 'comp_10', current_level: 3, last_assessed_at: '2025-01-25T13:15:00Z' },

  // Pooja Varma (FOD NSSO) - Strong in Field Operations & CAPI, Gap in National Accounts & CPI
  { id: 'sc_11', user_id: 'usr_iss_002', competency_id: 'comp_01', current_level: 4, last_assessed_at: '2025-02-10T10:00:00Z' },
  { id: 'sc_12', user_id: 'usr_iss_002', competency_id: 'comp_02', current_level: 2, last_assessed_at: '2024-09-12T14:30:00Z' },
  { id: 'sc_13', user_id: 'usr_iss_002', competency_id: 'comp_03', current_level: 2, last_assessed_at: '2024-10-01T12:00:00Z' },
  { id: 'sc_14', user_id: 'usr_iss_002', competency_id: 'comp_04', current_level: 2, last_assessed_at: '2024-11-20T16:00:00Z' },
  { id: 'sc_15', user_id: 'usr_iss_002', competency_id: 'comp_05', current_level: 3, last_assessed_at: '2025-01-15T09:00:00Z' },
  { id: 'sc_16', user_id: 'usr_iss_002', competency_id: 'comp_06', current_level: 4, last_assessed_at: '2025-02-18T11:20:00Z' },
  { id: 'sc_17', user_id: 'usr_iss_002', competency_id: 'comp_07', current_level: 3, last_assessed_at: '2025-01-05T15:10:00Z' },
  { id: 'sc_18', user_id: 'usr_iss_002', competency_id: 'comp_08', current_level: 3, last_assessed_at: '2024-12-18T10:45:00Z' },
  { id: 'sc_19', user_id: 'usr_iss_002', competency_id: 'comp_09', current_level: 5, last_assessed_at: '2025-02-04T09:30:00Z' },
  { id: 'sc_20', user_id: 'usr_iss_002', competency_id: 'comp_10', current_level: 3, last_assessed_at: '2025-01-15T13:15:00Z' },
];

export const SEED_IGOT_COURSES: IGotCourse[] = [
  {
    id: 'crs_01',
    course_title: 'Python for Official Microdata: NSSO Unit-Level Wrangling',
    provider: 'NSO Training Division (National Statistical Systems Training Academy)',
    competency_id: 'comp_05',
    target_level: 4,
    igot_course_id: 'IGOT-MOSPI-PY-401',
    duration_mins: 180,
    rating: 4.85,
    tags: ['Data Science', 'Python', 'NSSO Surveys', 'Microdata'],
  },
  {
    id: 'crs_02',
    course_title: 'CAPI Survey Instrumentation & Real-time Geo-Tagging Protocols',
    provider: 'Field Operations Division & Karmayogi Bharat',
    competency_id: 'comp_07',
    target_level: 3,
    igot_course_id: 'IGOT-FOD-CAPI-302',
    duration_mins: 120,
    rating: 4.75,
    tags: ['CAPI', 'Field Tech', 'GPS Tagging', 'Data Sync'],
  },
  {
    id: 'crs_03',
    course_title: 'CPI Concepts, Laspeyres Indexation & Web Portal Scrapers',
    provider: 'Economic Statistics Division (ESD) & ISTM',
    competency_id: 'comp_02',
    target_level: 4,
    igot_course_id: 'IGOT-ESD-CPI-403',
    duration_mins: 210,
    rating: 4.90,
    tags: ['CPI', 'Inflation', 'Laspeyres', 'Economic Statistics'],
  },
  {
    id: 'crs_04',
    course_title: 'System of National Accounts (SNA 2008) & Supply-Use Tables',
    provider: 'National Accounts Division (NAD) & Reserve Bank Staff College',
    competency_id: 'comp_04',
    target_level: 5,
    igot_course_id: 'IGOT-NAD-SNA-504',
    duration_mins: 300,
    rating: 4.95,
    tags: ['National Accounts', 'GVA', 'SNA 2008', 'Macroeconomics'],
  },
  {
    id: 'crs_05',
    course_title: 'IIP Base 2011-12 Revision, Factory Frame & Core Industries Index',
    provider: 'NSSTA Greater Noida',
    competency_id: 'comp_03',
    target_level: 4,
    igot_course_id: 'IGOT-ESD-IIP-405',
    duration_mins: 150,
    rating: 4.70,
    tags: ['IIP', 'Industrial Production', 'ASI Frame', 'Weights'],
  },
  {
    id: 'crs_06',
    course_title: 'Collection of Statistics Act 2008 & Data Privacy Governance',
    provider: 'Institute of Secretariat Training and Management (ISTM)',
    competency_id: 'comp_09',
    target_level: 5,
    igot_course_id: 'IGOT-LEG-ACT-506',
    duration_mins: 90,
    rating: 4.80,
    tags: ['Legislation', 'Ethics', 'Confidentiality', 'Governance'],
  },
  {
    id: 'crs_07',
    course_title: 'Advanced Sampling Theory & Non-Sampling Error Reduction',
    provider: 'Indian Statistical Institute (ISI) & MoSPI',
    competency_id: 'comp_01',
    target_level: 4,
    igot_course_id: 'IGOT-ISI-SMP-407',
    duration_mins: 240,
    rating: 4.92,
    tags: ['Sampling Design', 'Stratification', 'Variance Estimation'],
  }
];

export const SEED_LEARNING_MATERIALS: LearningMaterial[] = [
  {
    id: 'mat_01',
    title: 'NSSO 80th Round Household Survey Operations & Sampling Design Manual',
    uploaded_by: 'usr_iss_001',
    file_path: '/manuals/nsso_80th_round_manual.pdf',
    vector_namespace: 'nsso-survey-80',
    created_at: '2025-01-10T10:00:00Z',
    file_size: '4.2 MB',
    page_count: 148,
    category: 'Sampling & Field Methods',
    summary: 'Comprehensive guidelines on multi-stage stratified sampling, formation of sub-units (SUs), household listing schedule 0.0, and circular systematic sampling with equal probability.'
  },
  {
    id: 'mat_02',
    title: 'Consumer Price Index (CPI) Base 2012=100 Methodology & Compilation Guide',
    uploaded_by: 'usr_iss_001',
    file_path: '/manuals/cpi_base_2012_guide.pdf',
    vector_namespace: 'cpi-methodology-2012',
    created_at: '2025-01-12T14:30:00Z',
    file_size: '3.1 MB',
    page_count: 96,
    category: 'Price Statistics',
    summary: 'Official methodology for CPI Rural, Urban, and Combined. Details Laspeyres formula, elementary price relative aggregation via Geometric Mean, item non-response imputations, and rent indices.'
  },
  {
    id: 'mat_03',
    title: 'Index of Industrial Production (IIP Base 2011-12) Compilation Manual',
    uploaded_by: 'usr_iss_001',
    file_path: '/manuals/iip_compilation_guide.pdf',
    vector_namespace: 'iip-base-2011-12',
    created_at: '2025-01-15T09:15:00Z',
    file_size: '2.8 MB',
    page_count: 72,
    category: 'Industrial Statistics',
    summary: 'Framework covering Mining, Manufacturing, and Electricity sectors. Weighting diagram based on Annual Survey of Industries (ASI), compilation of Eight Core Industries Index, and item substitution rules.'
  },
  {
    id: 'mat_04',
    title: 'National Accounts Statistics: Sources and Methods (Gross Value Added & SUT)',
    uploaded_by: 'usr_iss_001',
    file_path: '/manuals/nas_sources_methods.pdf',
    vector_namespace: 'nas-sources-methods',
    created_at: '2025-01-20T11:00:00Z',
    file_size: '5.6 MB',
    page_count: 220,
    category: 'Macroeconomic Aggregates',
    summary: 'Detailed explanation of GVA compilation at basic prices, FISIM distribution, Supply-Use Tables (SUT), double deflation methodologies, and consumption of fixed capital (CFC).'
  }
];

export const SEED_QUIZZES: Quiz[] = [
  {
    id: 'quiz_cpi_01',
    material_id: 'mat_02',
    title: 'CPI Laspeyres Indexation & Elementary Price Relatives Assessment',
    blooms_level: 'Apply',
    time_limit_mins: 15,
    pass_percentage: 70,
    questions_json: [
      {
        id: 'q_cpi_01',
        question: 'Under the MoSPI CPI Base 2012 methodology, which mathematical formulation is utilized to calculate the elementary price index for a specific item at the market/village level across quotes?',
        options: [
          { key: 'A', text: 'Arithmetic Mean of price ratios (Carli formula)' },
          { key: 'B', text: 'Geometric Mean of price relatives (Jevons index formula)' },
          { key: 'C', text: 'Harmonic Mean of relative expenditures' },
          { key: 'D', text: 'Median quotation price weighted by consumption quantiles' }
        ],
        correct_key: 'B',
        explanation: 'According to Section 4.2 of the CPI Compilation Guide, MoSPI adopted the Jevons formula (Geometric Mean of price relatives) for elementary aggregates to eliminate the upward arithmetic bias inherent in the Carli index.',
        source_citation: {
          manual_title: 'Consumer Price Index (CPI) Base 2012=100 Methodology & Compilation Guide',
          section: 'Chapter 4: Elementary Aggregation & Index Compilation',
          page_or_para: 'Page 34, Paragraph 4.2.1',
          exact_quote: 'Elementary price relatives are aggregated across selected markets within a state using the Geometric Mean (Jevons formula) before applying base-year household expenditure weights.'
        },
        blooms_level: 'Remember'
      },
      {
        id: 'q_cpi_02',
        question: 'In an urban market where the base year price of a commodity is P0 = ₹80 and the current month quotation is Pt = ₹104, while the assigned item weight in the subgroup is W = 1.25%, what is the price relative and its weighted contribution?',
        options: [
          { key: 'A', text: 'Price Relative = 130.00; Weighted score = 1.625' },
          { key: 'B', text: 'Price Relative = 124.00; Weighted score = 1.550' },
          { key: 'C', text: 'Price Relative = 76.92; Weighted score = 0.961' },
          { key: 'D', text: 'Price Relative = 140.00; Weighted score = 1.750' }
        ],
        correct_key: 'A',
        explanation: 'Price Relative R = (Pt / P0) * 100 = (104 / 80) * 100 = 130.0. The weighted contribution is R * W = 130.0 * 0.0125 = 1.625.',
        source_citation: {
          manual_title: 'Consumer Price Index (CPI) Base 2012=100 Methodology & Compilation Guide',
          section: 'Chapter 5: Laspeyres Aggregation & Subgroup Compilation',
          page_or_para: 'Page 41, Formula 5.1',
          exact_quote: 'The sub-group index is computed using the modified Laspeyres formula by summing product of elementary price relatives and respective expenditure weights.'
        },
        blooms_level: 'Apply'
      },
      {
        id: 'q_cpi_03',
        question: 'When a shop in a sample village permanently closes and a substitute commodity specification is introduced, which imputation protocol is mandated by MoSPI to prevent spurious inflation distortion?',
        options: [
          { key: 'A', text: 'Zero price imputation until the next base revision' },
          { key: 'B', text: 'Carry forward the last observed quotation indefinitely' },
          { key: 'C', text: 'Overlap pricing method or linking factor calculation using imputed base price' },
          { key: 'D', text: 'Substitute with national wholesale price without base adjustment' }
        ],
        correct_key: 'C',
        explanation: 'MoSPI protocols strictly prohibit static carry-forward of missing prices. An imputed base price is calculated using the price ratio in the overlap period or through class-mean imputation from adjacent urban/rural blocks.',
        source_citation: {
          manual_title: 'Consumer Price Index (CPI) Base 2012=100 Methodology & Compilation Guide',
          section: 'Chapter 6: Handling Non-Response and Missing Price Imputations',
          page_or_para: 'Page 52, Paragraph 6.3.2',
          exact_quote: 'In cases of item substitution, base price revision via chained linking factors is mandated to decouple quality changes from genuine price trends.'
        },
        blooms_level: 'Analyze'
      },
      {
        id: 'q_cpi_04',
        question: 'What is the base period and primary source of weights for the current All-India Consumer Price Index (Rural, Urban, Combined)?',
        options: [
          { key: 'A', text: 'Base 2004-05; Wholesale Price Survey' },
          { key: 'B', text: 'Base 2012=100; NSSO 68th Round Consumer Expenditure Survey (2011-12)' },
          { key: 'C', text: 'Base 2017-18; Periodic Labour Force Survey (PLFS)' },
          { key: 'D', text: 'Base 2010=100; Annual Survey of Industries (ASI)' }
        ],
        correct_key: 'B',
        explanation: 'The current official MoSPI CPI series is anchored at Base 2012=100, deriving its weighting diagrams from the 68th Round Consumer Expenditure Survey (CES) conducted by NSSO during 2011-12.',
        source_citation: {
          manual_title: 'Consumer Price Index (CPI) Base 2012=100 Methodology & Compilation Guide',
          section: 'Chapter 1: Background & Weighting Diagram',
          page_or_para: 'Page 8, Section 1.4',
          exact_quote: 'The weighting diagram of the CPI (Rural/Urban/Combined) Base 2012=100 is based on the findings of the Consumer Expenditure Survey (CES) of the NSS 68th Round (July 2011 - June 2012).'
        },
        blooms_level: 'Remember'
      },
      {
        id: 'q_cpi_05',
        question: 'How is the rent index for owner-occupied dwellings treated in the official MoSPI CPI (Urban) compilation?',
        options: [
          { key: 'A', text: 'Excluded entirely from the CPI Urban weighting diagram' },
          { key: 'B', text: 'Imputed using a repeat chain-sample survey of rented dwellings across successive rounds' },
          { key: 'C', text: 'Estimated solely using commercial mortgage interest rates' },
          { key: 'D', text: 'Treated as equal to the rural housing index' }
        ],
        correct_key: 'B',
        explanation: 'In CPI (Urban), house rent is calculated through a six-monthly chain survey of rented dwellings, using the rental equivalency approach to represent owner-occupied houses.',
        source_citation: {
          manual_title: 'Consumer Price Index (CPI) Base 2012=100 Methodology & Compilation Guide',
          section: 'Chapter 7: House Rent Index Methodology',
          page_or_para: 'Page 59, Section 7.2',
          exact_quote: 'House rent index is compiled on a 6-month moving chain cycle covering selected urban sample dwellings, applying chain relative adjustments.'
        },
        blooms_level: 'Analyze'
      }
    ]
  },
  {
    id: 'quiz_nsso_01',
    material_id: 'mat_01',
    title: 'NSSO Multi-Stage Stratified Sampling & FSU Selection Mastery',
    blooms_level: 'Analyze',
    time_limit_mins: 20,
    pass_percentage: 75,
    questions_json: [
      {
        id: 'q_nsso_01',
        question: 'In NSSO rural sample design, what constitutes the First Stage Unit (FSU)?',
        options: [
          { key: 'A', text: 'Individual household' },
          { key: 'B', text: 'Census Village / Revenue Village' },
          { key: 'C', text: 'Urban Frame Survey (UFS) block' },
          { key: 'D', text: 'District administrative headquarters' }
        ],
        correct_key: 'B',
        explanation: 'In the rural sector, the First Stage Units (FSUs) are census villages as per the latest Population Census frame (or Panchayat wards in Kerala).',
        source_citation: {
          manual_title: 'NSSO 80th Round Household Survey Operations & Sampling Design Manual',
          section: 'Chapter 2: Sampling Design and Estimation Procedure',
          page_or_para: 'Page 19, Paragraph 2.2.1',
          exact_quote: 'The First Stage Units (FSUs) are Census villages in the rural sector and Urban Frame Survey (UFS) blocks in the urban sector.'
        },
        blooms_level: 'Remember'
      },
      {
        id: 'q_nsso_02',
        question: 'When an FSU village has an estimated population exceeding 1,200 persons during hamlet-group formation, what is the protocol for Sub-Unit (SU) formation?',
        options: [
          { key: 'A', text: 'Discard the FSU and substitute with a random neighbor' },
          { key: 'B', text: 'Divide into hamlet-groups of approximately equal population size and select two at random' },
          { key: 'C', text: 'Survey all households without sub-division' },
          { key: 'D', text: 'Only survey households residing on the village perimeter' }
        ],
        correct_key: 'B',
        explanation: 'When rural villages or urban blocks exceed the threshold population (typically 1,200 in rural or 1,400 in urban), the enumerator must delineate sub-units/hamlet-groups of roughly equal size, and 2 sub-units are selected by simple random sampling.',
        source_citation: {
          manual_title: 'NSSO 80th Round Household Survey Operations & Sampling Design Manual',
          section: 'Chapter 3: Formation of Sub-Units (SUs) and Hamlet-Groups',
          page_or_para: 'Page 31, Section 3.4',
          exact_quote: 'For large FSUs, division into hamlet-groups of equal size is strictly enforced. Two sub-units are selected: SU 1 (with maximum population) and SU 2 (randomly selected from remaining).'
        },
        blooms_level: 'Apply'
      },
      {
        id: 'q_nsso_03',
        question: 'Under circular systematic sampling, if population N = 80 and sample size n = 8, with a random start R = 7 and sampling interval I = 10, which sequence represents the correctly selected sample units?',
        options: [
          { key: 'A', text: '7, 17, 27, 37, 47, 57, 67, 77' },
          { key: 'B', text: '8, 18, 28, 38, 48, 58, 68, 78' },
          { key: 'C', text: '7, 14, 21, 28, 35, 42, 49, 56' },
          { key: 'D', text: '10, 20, 30, 40, 50, 60, 70, 80' }
        ],
        correct_key: 'A',
        explanation: 'With random start R = 7 and sampling interval I = N/n = 80/8 = 10, the selected elements are R + k*I: 7, 17, 27, 37, 47, 57, 67, 77.',
        source_citation: {
          manual_title: 'NSSO 80th Round Household Survey Operations & Sampling Design Manual',
          section: 'Chapter 4: Selection of Ultimate Sampling Units (Households)',
          page_or_para: 'Page 45, Rule 4.2',
          exact_quote: 'Households in each Second Stage Stratum (SSS) are selected by circular systematic sampling with equal probability without replacement.'
        },
        blooms_level: 'Apply'
      }
    ]
  }
];

export const SEED_ZONAL_ANALYTICS = [
  {
    zone: 'North Zone - New Delhi',
    headquarters: 'Sardar Patel Bhawan / R.K. Puram, New Delhi',
    officers_count: 420,
    avg_readiness_index: 78.4,
    domain_gap_avg: 1.1,
    tech_gap_avg: 1.8,
    behavioral_gap_avg: 0.6,
    top_gap_competency: 'Python & R for Official Microdata Analytics',
    apar_sync_rate: 92.5
  },
  {
    zone: 'East Zone - Kolkata',
    headquarters: 'Mahalanobis Bhavan, Baranagar, Kolkata',
    officers_count: 380,
    avg_readiness_index: 71.2,
    domain_gap_avg: 1.4,
    tech_gap_avg: 2.1,
    behavioral_gap_avg: 0.8,
    top_gap_competency: 'CPI Laspeyres Indexation & Price Relatives',
    apar_sync_rate: 84.0
  },
  {
    zone: 'South Zone - Bengaluru',
    headquarters: 'Kendriya Sadan, Koramangala, Bengaluru',
    officers_count: 340,
    avg_readiness_index: 82.6,
    domain_gap_avg: 0.8,
    tech_gap_avg: 1.2,
    behavioral_gap_avg: 0.5,
    top_gap_competency: 'System of National Accounts (SNA 2008)',
    apar_sync_rate: 95.8
  },
  {
    zone: 'West Zone - Mumbai',
    headquarters: 'CGO Complex, CBD Belapur / Mumbai',
    officers_count: 310,
    avg_readiness_index: 76.0,
    domain_gap_avg: 1.2,
    tech_gap_avg: 1.7,
    behavioral_gap_avg: 0.7,
    top_gap_competency: 'CAPI / Modern Digital Survey Instruments',
    apar_sync_rate: 88.2
  },
  {
    zone: 'Central Zone - Bhopal',
    headquarters: 'Paryavaran Parisar, Bhopal',
    officers_count: 220,
    avg_readiness_index: 68.5,
    domain_gap_avg: 1.6,
    tech_gap_avg: 2.4,
    behavioral_gap_avg: 0.9,
    top_gap_competency: 'Python & R for Official Microdata Analytics',
    apar_sync_rate: 79.0
  }
];
