export interface TextChunk {
  id: string;
  namespace: string;
  manual_title: string;
  section: string;
  page_or_para: string;
  text: string;
  keywords: string[];
}

export const MOSPI_OFFICIAL_CHUNKS: TextChunk[] = [
  // CPI Manual Chunks
  {
    id: 'cpi_chk_01',
    namespace: 'cpi-methodology-2012',
    manual_title: 'Consumer Price Index (CPI) Base 2012=100 Methodology & Compilation Guide',
    section: 'Chapter 4: Elementary Aggregates and Price Relatives',
    page_or_para: 'Page 34, Paragraph 4.2.1',
    text: 'At the elementary aggregate level, price relatives across selected markets within each state are computed using the Geometric Mean (Jevons Index formula). The formula is: R_i = (∏ (P_t,j / P_0,j))^(1/m), where P_t,j is the current price quote in market j, P_0,j is the base price quote, and m is the number of valid quotations. The arithmetic mean (Carli index) was deprecated due to its inherent upward bias and failure of the time-reversal test.',
    keywords: ['geometric mean', 'jevons', 'elementary aggregate', 'price relative', 'carli', 'bias', 'cpi']
  },
  {
    id: 'cpi_chk_02',
    namespace: 'cpi-methodology-2012',
    manual_title: 'Consumer Price Index (CPI) Base 2012=100 Methodology & Compilation Guide',
    section: 'Chapter 5: Modified Laspeyres Aggregation',
    page_or_para: 'Page 41, Formula 5.1',
    text: 'Sub-group, group, and general consumer price indices are compiled using the Modified Laspeyres formulation: I_t = (∑ W_i * R_i,t) / (∑ W_i), where W_i is the base period household consumption expenditure weight derived from the NSS 68th Round Consumer Expenditure Survey (2011-12), and R_i,t is the elementary price relative for item i at period t.',
    keywords: ['laspeyres', 'sub-group', 'weighting diagram', 'nss 68th round', 'ces', 'expenditure weight']
  },
  {
    id: 'cpi_chk_03',
    namespace: 'cpi-methodology-2012',
    manual_title: 'Consumer Price Index (CPI) Base 2012=100 Methodology & Compilation Guide',
    section: 'Chapter 6: Missing Price Imputations and Substitutions',
    page_or_para: 'Page 52, Paragraph 6.3.2',
    text: 'When a quotation is temporarily missing, the price is imputed based on the average price movement of the same item in adjoining markets within the same stratum. If an item specification becomes permanently unavailable, a close substitute is selected, and an overlap pricing method is applied to establish an imputed base price, preventing spurious inflation spikes.',
    keywords: ['imputation', 'missing price', 'overlap pricing', 'item substitution', 'spurious inflation', 'stratum']
  },
  {
    id: 'cpi_chk_04',
    namespace: 'cpi-methodology-2012',
    manual_title: 'Consumer Price Index (CPI) Base 2012=100 Methodology & Compilation Guide',
    section: 'Chapter 7: House Rent Index for Urban Areas',
    page_or_para: 'Page 59, Section 7.2',
    text: 'The House Rent Index in CPI Urban covers a chain-panel of rented dwellings across successive rounds. A 6-month moving chain relative approach is utilized where one-sixth of the sample dwellings are visited each month. Rents for owner-occupied dwellings are represented through rental equivalency calculated from comparable rented dwellings in the same urban block.',
    keywords: ['house rent', 'urban', 'chain-panel', 'rental equivalency', 'six-monthly', 'dwellings']
  },

  // NSSO 80th Round Sampling Manual Chunks
  {
    id: 'nsso_chk_01',
    namespace: 'nsso-survey-80',
    manual_title: 'NSSO 80th Round Household Survey Operations & Sampling Design Manual',
    section: 'Chapter 2: Sampling Design & First Stage Units',
    page_or_para: 'Page 19, Paragraph 2.2.1',
    text: 'A stratified two-stage sampling design is adopted. In the rural sector, the First Stage Units (FSUs) are Census Villages as per the Census frame (or Panchayat wards in Kerala). In the urban sector, FSUs are Urban Frame Survey (UFS) blocks. Ultimate Sampling Units (USUs) are households in both sectors.',
    keywords: ['sampling design', 'two-stage', 'fsu', 'first stage unit', 'census village', 'ufs', 'urban frame survey', 'usu']
  },
  {
    id: 'nsso_chk_02',
    namespace: 'nsso-survey-80',
    manual_title: 'NSSO 80th Round Household Survey Operations & Sampling Design Manual',
    section: 'Chapter 3: Hamlet-Group and Sub-Unit Formation',
    page_or_para: 'Page 31, Section 3.4',
    text: 'Large FSUs with an estimated population of 1,200 or more in rural areas (or 1,400 or more in urban areas) are divided into a specified number of sub-units (SUs) or hamlet-groups of approximately equal population. Two sub-units are selected: SU 1 is purposively selected as the sub-unit with maximum population/order, and SU 2 is randomly selected from the remaining sub-units by SRSWOR.',
    keywords: ['hamlet-group', 'sub-unit', 'large fsu', 'population threshold', 'srswor', 'sub-division']
  },
  {
    id: 'nsso_chk_03',
    namespace: 'nsso-survey-80',
    manual_title: 'NSSO 80th Round Household Survey Operations & Sampling Design Manual',
    section: 'Chapter 4: Selection of Sample Households and Multiplier Weights',
    page_or_para: 'Page 45, Rule 4.2',
    text: 'Within each selected FSU (or sub-unit), listed households are stratified into Second Stage Strata (SSS) based on household consumption expenditure or enterprise activity. Households within each SSS are selected by circular systematic sampling with equal probability without replacement. Multiplier weights are calibrated against projected population totals to generate unbiased national estimates.',
    keywords: ['circular systematic sampling', 'sss', 'second stage strata', 'multiplier weights', 'unbiased estimation']
  },

  // IIP Base 2011-12 Compilation Chunks
  {
    id: 'iip_chk_01',
    namespace: 'iip-base-2011-12',
    manual_title: 'Index of Industrial Production (IIP Base 2011-12) Compilation Manual',
    section: 'Chapter 2: Sectoral Coverage & Item Basket',
    page_or_para: 'Page 14, Section 2.1',
    text: 'The IIP Base 2011-12 covers three broad sectors: Mining (weight 14.37%), Manufacturing (weight 77.63%), and Electricity (weight 8.00%). The item basket comprises 839 items grouped into 407 item groups. The Annual Survey of Industries (ASI) 2011-12 forms the sampling frame for factory production units contributing to gross value of output.',
    keywords: ['iip', 'mining', 'manufacturing', 'electricity', 'item basket', 'asi', 'weights']
  },
  {
    id: 'iip_chk_02',
    namespace: 'iip-base-2011-12',
    manual_title: 'Index of Industrial Production (IIP Base 2011-12) Compilation Manual',
    section: 'Chapter 4: Eight Core Industries Index',
    page_or_para: 'Page 28, Section 4.3',
    text: 'The Index of Eight Core Industries comprises Coal, Crude Oil, Natural Gas, Refinery Products, Fertilizers, Steel, Cement, and Electricity, carrying a combined weight of 40.27% in the overall IIP. Refinery Products carries the highest individual weight (28.04% within core industries), followed by Electricity (19.85%) and Steel (17.92%).',
    keywords: ['eight core industries', 'core sector', 'refinery products', 'electricity', 'steel', 'coal', '40.27%']
  },

  // National Accounts Statistics Chunks
  {
    id: 'nas_chk_01',
    namespace: 'nas-sources-methods',
    manual_title: 'National Accounts Statistics: Sources and Methods (Gross Value Added & SUT)',
    section: 'Chapter 3: Gross Value Added (GVA) at Basic Prices',
    page_or_para: 'Page 48, Section 3.2',
    text: 'Gross Value Added (GVA) at basic prices is defined as Output at basic prices minus Intermediate Consumption at purchaser prices. GDP at market prices is derived as GVA at basic prices plus Product Taxes minus Product Subsidies. Basic prices exclude any taxes on products payable on the good or service but include any subsidies on products receivable.',
    keywords: ['gva', 'basic prices', 'gdp', 'market prices', 'intermediate consumption', 'product taxes', 'subsidies']
  },
  {
    id: 'nas_chk_02',
    namespace: 'nas-sources-methods',
    manual_title: 'National Accounts Statistics: Sources and Methods (Gross Value Added & SUT)',
    section: 'Chapter 6: FISIM Allocation & Double Deflation',
    page_or_para: 'Page 82, Paragraph 6.4',
    text: 'Financial Intermediation Services Indirectly Measured (FISIM) is measured as the difference between interest received on loans and interest paid on deposits relative to a pure reference rate of interest. FISIM is allocated among intermediate consumption of industries and final consumption of households. In constant price estimation, double deflation deflates gross output with output deflators and intermediate inputs with input-specific deflators.',
    keywords: ['fisim', 'double deflation', 'reference rate', 'deflator', 'intermediate consumption', 'sut']
  }
];
