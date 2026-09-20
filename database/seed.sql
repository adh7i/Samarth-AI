-- ====================================================================
-- StatSamarth AI: PostgreSQL Seed Data
-- Populates authentic MoSPI Cadres, FRAC Competencies & iGOT Courses
-- ====================================================================

-- 1. Seed Users (Indian Statistical Service Officers across Zones)
INSERT INTO users (id, name, email, role_title, zone, department, apar_id) VALUES
('usr_iss_001', 'Dr. Rajeshwar Sharma, ISS', 'rajeshwar.sharma@mospi.gov.in', 'Senior Statistical Officer (ISS)', 'North Zone - New Delhi', 'National Accounts Division (NAD)', 'APAR-2025-ISS-8842'),
('usr_iss_002', 'Pooja Varma, ISS', 'pooja.varma@mospi.gov.in', 'Sub-Assistant Director (FOD NSSO)', 'East Zone - Kolkata', 'Field Operations Division (FOD), NSSO', 'APAR-2025-ISS-9120'),
('usr_iss_003', 'Ananthakrishnan K., SSS', 'k.ananthakrishnan@mospi.gov.in', 'Junior Statistical Officer (ESD)', 'South Zone - Bengaluru', 'Economic Statistics Division (ESD - CPI/IIP)', 'APAR-2025-SSS-4401'),
('usr_iss_004', 'Sunita Deshmukh', 'sunita.deshmukh@mospi.gov.in', 'Joint Director (DIID)', 'West Zone - Mumbai', 'Data Informatics and Innovation Division', 'APAR-2025-ISS-3211')
ON CONFLICT (id) DO NOTHING;

-- 2. Seed FRAC Competencies
INSERT INTO frac_competencies (id, competency_name, category, required_level, code, description) VALUES
('comp_01', 'Sampling Design & NSSO Survey Methodologies', 'Domain', 4, 'FRAC-DOM-SMPL-01', 'Mastery over multi-stage stratified sampling, circular systematic sampling, selection of FSUs, and sampling weight calibration.'),
('comp_02', 'CPI Laspeyres Indexation & Price Relatives', 'Domain', 4, 'FRAC-DOM-CPI-02', 'Formulation of base 2012=100 consumer price indices, geometric mean calculation of price relatives, and overlap pricing.'),
('comp_03', 'IIP Base 2011-12 Compilation & Core Weights', 'Domain', 4, 'FRAC-DOM-IIP-03', 'Understanding factory sector coverage, eight core industries weighting matrix (40.27%), and seasonal adjustments.'),
('comp_04', 'National Accounts Statistics & GVA Estimation', 'Domain', 5, 'FRAC-DOM-NAS-04', 'System of National Accounts (SNA 2008), Gross Value Added by economic activity, FISIM distribution, and Supply-Use Tables (SUT).'),
('comp_05', 'Python & R for Official Microdata Analytics', 'Technical', 4, 'FRAC-TECH-PYR-05', 'Advanced data wrangling on large NSSO unit-level data files, pandas pipeline development, and survey multipliers.'),
('comp_06', 'Data Quality Audit & Non-Sampling Errors', 'Technical', 4, 'FRAC-TECH-DQA-06', 'Auditing field enumerator responses, outlier detection rules, item non-response imputation, and variance controls.'),
('comp_07', 'CAPI / Modern Digital Survey Instruments', 'Technical', 3, 'FRAC-TECH-CAPI-07', 'Deployment and real-time syncing of CAPI tablets, GPS geo-tagging of sample households, and offline validation scripts.'),
('comp_08', 'Statistical Evidence & Policy Formulation', 'Behavioral', 4, 'FRAC-BEH-EVP-08', 'Translating complex macro-economic indicators into executive policy notes and parliamentary replies.'),
('comp_09', 'Ethical Data Governance & Statistics Act', 'Behavioral', 5, 'FRAC-BEH-GOV-09', 'Strict adherence to Collection of Statistics Act 2008, confidentiality protocols, and UN Fundamental Principles.'),
('comp_10', 'Inter-Departmental Coordination & Mentorship', 'Behavioral', 3, 'FRAC-BEH-CRD-10', 'Collaborating with State DES (Directorates of Economics and Statistics) and training junior field enumerators.')
ON CONFLICT (id) DO NOTHING;

-- 3. Seed User Competency Scores (Dr. Rajeshwar Sharma - ISS)
INSERT INTO user_competency_scores (id, user_id, competency_id, current_level) VALUES
('sc_01', 'usr_iss_001', 'comp_01', 4),
('sc_02', 'usr_iss_001', 'comp_02', 3), -- Gap (-1)
('sc_03', 'usr_iss_001', 'comp_03', 4),
('sc_04', 'usr_iss_001', 'comp_04', 5), -- Verified
('sc_05', 'usr_iss_001', 'comp_05', 2), -- Gap (-2)
('sc_06', 'usr_iss_001', 'comp_06', 4),
('sc_07', 'usr_iss_001', 'comp_07', 2), -- Gap (-1)
('sc_08', 'usr_iss_001', 'comp_08', 4),
('sc_09', 'usr_iss_001', 'comp_09', 5), -- Verified
('sc_10', 'usr_iss_001', 'comp_10', 3)
ON CONFLICT (id) DO NOTHING;

-- 4. Seed iGOT Courses
INSERT INTO igot_courses (id, course_title, provider, competency_id, target_level, igot_course_id, duration_mins, rating) VALUES
('crs_01', 'Python for Official Microdata: NSSO Unit-Level Wrangling', 'NSO Training Division (NSSTA)', 'comp_05', 4, 'IGOT-MOSPI-PY-401', 180, 4.85),
('crs_02', 'CAPI Survey Instrumentation & Real-time Geo-Tagging Protocols', 'Field Operations Division & Karmayogi Bharat', 'comp_07', 3, 'IGOT-FOD-CAPI-302', 120, 4.75),
('crs_03', 'CPI Concepts, Laspeyres Indexation & Web Portal Scrapers', 'Economic Statistics Division (ESD) & ISTM', 'comp_02', 4, 'IGOT-ESD-CPI-403', 210, 4.90),
('crs_04', 'System of National Accounts (SNA 2008) & Supply-Use Tables', 'National Accounts Division (NAD) & RBI Staff College', 'comp_04', 5, 'IGOT-NAD-SNA-504', 300, 4.95),
('crs_05', 'IIP Base 2011-12 Revision, Factory Frame & Core Industries Index', 'NSSTA Greater Noida', 'comp_03', 4, 'IGOT-ESD-IIP-405', 150, 4.70),
('crs_06', 'Collection of Statistics Act 2008 & Data Privacy Governance', 'Institute of Secretariat Training and Management (ISTM)', 'comp_09', 5, 'IGOT-LEG-ACT-506', 90, 4.80)
ON CONFLICT (id) DO NOTHING;

-- 5. Seed Learning Materials
INSERT INTO learning_materials (id, title, uploaded_by, file_path, vector_namespace, category, page_count, file_size, summary) VALUES
('mat_01', 'NSSO 80th Round Household Survey Operations & Sampling Design Manual', 'usr_iss_001', '/manuals/nsso_80th_round_manual.pdf', 'nsso-survey-80', 'Sampling & Field Methods', 148, '4.2 MB', 'Guidelines on multi-stage stratified sampling, formation of sub-units (SUs), household listing schedule 0.0, and circular systematic sampling.'),
('mat_02', 'Consumer Price Index (CPI Base 2012=100) Methodology & Compilation Guide', 'usr_iss_001', '/manuals/cpi_base_2012_guide.pdf', 'cpi-methodology-2012', 'Price Statistics', 96, '3.1 MB', 'Official methodology for CPI Rural, Urban, and Combined. Details Laspeyres formula, Jevons geometric mean, and overlap pricing.'),
('mat_03', 'Index of Industrial Production (IIP Base 2011-12) Compilation Manual', 'usr_iss_001', '/manuals/iip_compilation_guide.pdf', 'iip-base-2011-12', 'Industrial Statistics', 72, '2.8 MB', 'Framework covering Mining, Manufacturing, and Electricity sectors. Eight Core Industries Index weighting diagram (40.27%).'),
('mat_04', 'National Accounts Statistics: Sources and Methods (Gross Value Added & SUT)', 'usr_iss_001', '/manuals/nas_sources_methods.pdf', 'nas-sources-methods', 'Macroeconomic Aggregates', 220, '5.6 MB', 'Detailed explanation of GVA compilation at basic prices, FISIM distribution, Supply-Use Tables (SUT), and double deflation.')
ON CONFLICT (id) DO NOTHING;
