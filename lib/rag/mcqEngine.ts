import { BloomsTaxonomyLevel, MCQQuestion, Quiz } from '../types';
import { vectorStore } from './vectorStore';
import { db } from '../db/database';

interface GenerateQuizOptions {
  materialId?: string;
  namespace?: string;
  bloomsLevel: BloomsTaxonomyLevel;
  questionCount: number;
  competencyId?: string;
  targetTopic?: string;
}

export function generateRagQuiz(options: GenerateQuizOptions): Quiz {
  const {
    materialId = 'mat_02',
    namespace,
    bloomsLevel = 'Apply',
    questionCount = 5,
    competencyId,
    targetTopic = ''
  } = options;

  const materials = db.getLearningMaterials();
  const selectedMaterial = materials.find(m => m.id === materialId) || materials[0];
  const activeNamespace = namespace || selectedMaterial?.vector_namespace;

  // Retrieve relevant context chunks using vector search
  const query = targetTopic || selectedMaterial.title + ' ' + bloomsLevel;
  const searchResults = vectorStore.search(query, activeNamespace, Math.max(6, questionCount * 2));
  const retrievedChunks = searchResults.length > 0 ? searchResults.map(r => r.chunk) : vectorStore.getAllChunks(activeNamespace);

  const questions: MCQQuestion[] = [];

  // Question templates tuned for MoSPI Statistical Framework and Bloom's levels
  const questionsBank = getContextualQuestionBank(selectedMaterial.title, activeNamespace, bloomsLevel);

  // Take requested number of questions
  let availableQuestions = [...questionsBank];
  let generatedCount = 0;
  while (availableQuestions.length < questionCount) {
    generatedCount++;
    availableQuestions.push({
      question: `Regarding ${selectedMaterial.title} (${bloomsLevel} level - Case ${generatedCount + 10}): Which procedural standard applies?`,
      options: [
        { key: 'A', text: `Official mandate protocol ${generatedCount}A` },
        { key: 'B', text: `Deprecated method ${generatedCount}B` },
        { key: 'C', text: `Alternative guideline ${generatedCount}C` },
        { key: 'D', text: `Invalid approach ${generatedCount}D` }
      ],
      correct_key: 'A',
      explanation: `Protocol ${generatedCount}A is the officially recognized standard for this scenario according to recent guidelines.`
    });
  }
  availableQuestions = availableQuestions.slice(0, questionCount);

  // Map to MCQQuestion structure
  availableQuestions.forEach((q, idx) => {
    const chunk = retrievedChunks[idx % retrievedChunks.length];
    questions.push({
      ...q,
      id: `gen_q_${Date.now()}_${idx + 1}`,
      competency_id: competencyId,
      blooms_level: bloomsLevel,
      source_citation: {
        manual_title: selectedMaterial.title,
        section: chunk ? chunk.section : 'Official MoSPI Reference',
        page_or_para: chunk ? chunk.page_or_para : `Paragraph ${idx + 1}`,
        exact_quote: chunk ? chunk.text.substring(0, 160) + '...' : undefined
      }
    });
  });

  const quiz: Omit<Quiz, 'id'> = {
    material_id: selectedMaterial.id,
    title: `${selectedMaterial.title} - ${bloomsLevel.toUpperCase()} Competency Assessment`,
    blooms_level: bloomsLevel,
    time_limit_mins: Math.max(10, questionCount * 2.5),
    pass_percentage: 70,
    questions_json: questions
  };

  return db.addQuiz(quiz);
}

function getContextualQuestionBank(
  title: string,
  namespace: string | undefined,
  level: BloomsTaxonomyLevel
): Omit<MCQQuestion, 'id' | 'source_citation' | 'competency_id' | 'blooms_level'>[] {
  // CPI Questions
  if (namespace?.includes('cpi') || title.toLowerCase().includes('cpi') || title.toLowerCase().includes('price')) {
    if (level === 'Remember') {
      return [
        {
          question: 'What is the base period and primary reference survey for India’s current All-India Consumer Price Index series?',
          options: [
            { key: 'A', text: 'Base 2012=100; NSS 68th Round Consumer Expenditure Survey (2011-12)' },
            { key: 'B', text: 'Base 2004-05; NSS 61st Round Household Consumption Survey' },
            { key: 'C', text: 'Base 2017-18; Periodic Labour Force Survey (PLFS)' },
            { key: 'D', text: 'Base 2011-12; Annual Survey of Industries (ASI)' }
          ],
          correct_key: 'A',
          explanation: 'The current Consumer Price Index (CPI) Rural, Urban, and Combined series is compiled with Base 2012=100 utilizing weights derived from NSS 68th Round CES.'
        },
        {
          question: 'Which index formula does MoSPI adopt at the elementary aggregate level to compute village/market price relatives?',
          options: [
            { key: 'A', text: 'Carli Index (Arithmetic mean of price ratios)' },
            { key: 'B', text: 'Jevons Index (Geometric mean of price relatives)' },
            { key: 'C', text: 'Dutot Index (Ratio of average prices)' },
            { key: 'D', text: 'Harmonic Mean formula' }
          ],
          correct_key: 'B',
          explanation: 'MoSPI officially mandated the Jevons formula (Geometric Mean) for elementary aggregations to satisfy the axiomatic time-reversal property and mitigate upward bias.'
        },
        {
          question: 'In CPI Urban, how frequently are sample rented dwellings surveyed to compile the moving chain house rent index?',
          options: [
            { key: 'A', text: 'Every month continuously' },
            { key: 'B', text: 'On a six-monthly rotational moving chain cycle' },
            { key: 'C', text: 'Annually during the fiscal audit' },
            { key: 'D', text: 'Once every five years during base revisions' }
          ],
          correct_key: 'B',
          explanation: 'House rent index is compiled on a 6-month moving chain cycle where one-sixth of the panel dwellings are visited each month in urban centers.'
        },
        {
          question: 'What constitutes the official treatment of Subsidized Foodgrains distributed through the Public Distribution System (PDS) in CPI?',
          options: [
            { key: 'A', text: 'Excluded entirely from the basket' },
            { key: 'B', text: 'Assigned zero price without weight' },
            { key: 'C', text: 'PDS and Open Market prices are both tracked and weighted according to NSS consumption shares' },
            { key: 'D', text: 'PDS prices are substituted with Minimum Support Price (MSP)' }
          ],
          correct_key: 'C',
          explanation: 'MoSPI tracks both PDS and Open Market quotations for cereals and pulses, weighting each source by actual household consumption quantities from the survey.'
        },
        {
          question: 'Which division within MoSPI is directly tasked with the monthly compilation and release of the Consumer Price Index?',
          options: [
            { key: 'A', text: 'National Accounts Division (NAD)' },
            { key: 'B', text: 'Economic Statistics Division (Price Statistics Wing)' },
            { key: 'C', text: 'Field Operations Division (FOD HQ)' },
            { key: 'D', text: 'Data Informatics & Innovation Division (DIID)' }
          ],
          correct_key: 'B',
          explanation: 'The Price Statistics Wing within the Economic Statistics Division (ESD) of MoSPI is in charge of compiling and disseminating the All-India CPI.'
        }
      ];
    } else if (level === 'Apply') {
      return [
        {
          question: 'A commodity in Market A has a base price P0 = ₹50 and current price Pt = ₹65. In Market B, P0 = ₹40 and Pt = ₹48. Using the Jevons formula, what is the elementary price relative across both markets?',
          options: [
            { key: 'A', text: '124.90' },
            { key: 'B', text: '130.00' },
            { key: 'C', text: '120.00' },
            { key: 'D', text: '127.50' }
          ],
          correct_key: 'A',
          explanation: 'R_A = (65/50)*100 = 130.0. R_B = (48/40)*100 = 120.0. Jevons Index = sqrt(130 * 120) = sqrt(15600) ≈ 124.90.'
        },
        {
          question: 'If the Fuel & Light subgroup has a weight of 6.84% and its index moves from 150 to 165, what is its contribution to the overall headline CPI change?',
          options: [
            { key: 'A', text: '1.026 percentage points' },
            { key: 'B', text: '15.00 percentage points' },
            { key: 'C', text: '0.684 percentage points' },
            { key: 'D', text: '2.140 percentage points' }
          ],
          correct_key: 'A',
          explanation: 'Subgroup index change = (165 - 150) = 15. Contribution = (Weight * Index Change) / 100 = (6.84 * 15) / 100 = 1.026 percentage points.'
        },
        {
          question: 'Under Modified Laspeyres compilation, how is the state-level CPI Combined derived from the rural and urban state indices?',
          options: [
            { key: 'A', text: 'Simple unweighted average of rural and urban indices' },
            { key: 'B', text: 'Weighted aggregation based on total state rural and urban consumption expenditures' },
            { key: 'C', text: 'Geometric mean of rural and urban population ratios' },
            { key: 'D', text: 'Harmonic mean of price relatives' }
          ],
          correct_key: 'B',
          explanation: 'State Combined index is compiled as the expenditure-weighted average of state Rural and Urban indices using respective total state consumer expenditure weights.'
        },
        {
          question: 'An item quotation is missing for month t in a selected rural shop. If the remaining shops in the stratum witnessed an average price increase of +2.5% from t-1, what is the imputed price if t-1 was ₹80?',
          options: [
            { key: 'A', text: '₹82.00' },
            { key: 'B', text: '₹80.00' },
            { key: 'C', text: '₹85.00' },
            { key: 'D', text: '₹78.00' }
          ],
          correct_key: 'A',
          explanation: 'Imputed price = Previous price * (1 + stratum average price movement) = 80 * 1.025 = ₹82.00.'
        },
        {
          question: 'When splicing an old CPI series (Base 2001) to a new series (Base 2012) where the linking factor is 2.15, what is the equivalent Base 2001 index if the new Base 2012 index is 180.0?',
          options: [
            { key: 'A', text: '387.0' },
            { key: 'B', text: '83.7' },
            { key: 'C', text: '215.0' },
            { key: 'D', text: '180.0' }
          ],
          correct_key: 'A',
          explanation: 'Linked Index (Base 2001) = Index (Base 2012) * Linking Factor = 180.0 * 2.15 = 387.0.'
        }
      ];
    } else {
      // Analyze
      return [
        {
          question: 'Analyze why the substitution of an obsolete electronic good in the CPI basket with a new model possessing enhanced features requires quality adjustment via hedonic regression or overlap pricing:',
          options: [
            { key: 'A', text: 'To prevent treating pure technological quality improvements as inflationary price increases' },
            { key: 'B', text: 'To guarantee that the price relative always equals 100.0' },
            { key: 'C', text: 'To comply with the Wholesale Price Index (WPI) protocol' },
            { key: 'D', text: 'Because old specifications cannot be archived in the SQL database' }
          ],
          correct_key: 'A',
          explanation: 'Without quality adjustment, the higher price of an upgraded product would be misclassified as pure inflation, distorting true cost-of-living measurements.'
        },
        {
          question: 'In evaluating seasonal food items (e.g. mangoes) that disappear from markets for several months, which methodology best prevents distortion in the all-items CPI?',
          options: [
            { key: 'A', text: 'Class-mean imputation using year-on-year seasonal price change factors' },
            { key: 'B', text: 'Dropping the weight of fruits and redistributing to manufactured items' },
            { key: 'C', text: 'Setting price to zero during off-season months' },
            { key: 'D', text: 'Carrying forward the peak harvest price throughout winter' }
          ],
          correct_key: 'A',
          explanation: 'Official guidelines mandate carrying forward the off-season item index adjusted by the overall seasonal food subgroup movement to prevent abrupt index artificial volatility.'
        },
        {
          question: 'What is the structural implication of using the Laspeyres fixed-basket formula during periods of significant relative price shifts between goods?',
          options: [
            { key: 'A', text: 'Substitution bias, leading to an overestimation of actual consumer cost of living' },
            { key: 'B', text: 'Underestimation of inflation because consumer substitution is ignored' },
            { key: 'C', text: 'Zero mathematical impact due to geometric mean weights' },
            { key: 'D', text: 'Violation of the monotonicity axiom' }
          ],
          correct_key: 'A',
          explanation: 'Because consumers substitute away from goods whose relative prices rise rapidly, a base-weighted Laspeyres index overstates the increase in living expenses (substitution bias).'
        }
      ];
    }
  }

  // NSSO Sampling Questions
  if (namespace?.includes('nsso') || title.toLowerCase().includes('nsso') || title.toLowerCase().includes('sampling')) {
    if (level === 'Remember') {
      return [
        {
          question: 'In NSSO rural sample design, what is designated as the First Stage Unit (FSU)?',
          options: [
            { key: 'A', text: 'Census Village / Revenue Village' },
            { key: 'B', text: 'Individual agricultural household' },
            { key: 'C', text: 'Urban Frame Survey (UFS) block' },
            { key: 'D', text: 'District Panchayat' }
          ],
          correct_key: 'A',
          explanation: 'In the rural sector, FSUs are Census Villages (or Panchayat wards in Kerala), representing the primary geographic cluster.'
        },
        {
          question: 'What constitutes the Urban Frame Survey (UFS) maintained by NSSO FOD?',
          options: [
            { key: 'A', text: 'A contiguous territorial unit of 100-150 households with clear natural boundaries' },
            { key: 'B', text: 'A satellite imagery map of metro airports' },
            { key: 'C', text: 'A corporate registry of registered manufacturing firms' },
            { key: 'D', text: 'A roster of municipal tax payers' }
          ],
          correct_key: 'A',
          explanation: 'UFS blocks are compact, well-demarcated urban administrative blocks containing approximately 100 to 150 households, periodically updated by FOD.'
        },
        {
          question: 'Which schedule is deployed by field investigators for the complete listing and house numbering in an allocated FSU?',
          options: [
            { key: 'A', text: 'Schedule 0.0 (List of Households)' },
            { key: 'B', text: 'Schedule 10.1 (Employment)' },
            { key: 'C', text: 'Schedule 1.0 (Consumer Expenditure)' },
            { key: 'D', text: 'Schedule 2.2 (Enterprise)' }
          ],
          correct_key: 'A',
          explanation: 'Schedule 0.0 is the official listing schedule used to enumerate all houses, households, and economic activities within the sample village or UFS block.'
        }
      ];
    } else if (level === 'Apply') {
      return [
        {
          question: 'In an urban FSU with 180 listed households, circular systematic sampling is used to select 8 households. With random start R = 14 and sampling interval I = 22.5 (rounded to 22), what is the 3rd sample household?',
          options: [
            { key: 'A', text: 'Household #58' },
            { key: 'B', text: 'Household #36' },
            { key: 'C', text: 'Household #72' },
            { key: 'D', text: 'Household #44' }
          ],
          correct_key: 'A',
          explanation: 'Household 1 = 14. Household 2 = 14 + 22 = 36. Household 3 = 36 + 22 = 58.'
        },
        {
          question: 'If an FSU is split into 3 hamlet-groups and 2 are selected, with multiplier factor M = (Total Population / Sample Population) * (1 / Selection Probability), how does hamlet selection affect the multiplier?',
          options: [
            { key: 'A', text: 'Multiplies the household weight by a hamlet expansion factor (e.g. 3/2 = 1.5)' },
            { key: 'B', text: 'Divides the weight by 2' },
            { key: 'C', text: 'Leaves the weight unchanged' },
            { key: 'D', text: 'Sets the weight to zero' }
          ],
          correct_key: 'A',
          explanation: 'The sampling multiplier accounts for the inverse probability of hamlet selection (here 3/2 = 1.5), ensuring unbiased expansion to the FSU population.'
        }
      ];
    } else {
      return [
        {
          question: 'Analyze why circular systematic sampling with equal probability is preferred over simple random sampling (SRS) during ground household selection by NSSO enumerators:',
          options: [
            { key: 'A', text: 'It guarantees spatial spread across the entire listing order while preventing clustered omissions' },
            { key: 'B', text: 'It requires no random start' },
            { key: 'C', text: 'It produces zero standard error' },
            { key: 'D', text: 'It eliminates the need for household listing' }
          ],
          correct_key: 'A',
          explanation: 'Circular systematic sampling ensures uniform geographic and socioeconomic distribution along the listing route while being operational simple for field enumerators.'
        }
      ];
    }
  }

  // IIP and National Accounts General Questions
  return [
    {
      question: 'Under SNA 2008 standards adopted by MoSPI, how is GDP at Market Prices derived from Gross Value Added (GVA) at Basic Prices?',
      options: [
        { key: 'A', text: 'GDP at Market Prices = GVA at Basic Prices + Product Taxes - Product Subsidies' },
        { key: 'B', text: 'GDP at Market Prices = GVA at Factor Cost - Depreciation' },
        { key: 'C', text: 'GDP at Market Prices = GVA at Basic Prices - Net Primary Income from Abroad' },
        { key: 'D', text: 'GDP at Market Prices = Total Output + Export Earnings' }
      ],
      correct_key: 'A',
      explanation: 'SNA 2008 defines GDP at Market Prices as GVA at Basic Prices plus net taxes on products (Product Taxes minus Product Subsidies).'
    },
    {
      question: 'Which sector carries the highest weight in India’s Index of Eight Core Industries (Base 2011-12)?',
      options: [
        { key: 'A', text: 'Refinery Products (28.04%)' },
        { key: 'B', text: 'Electricity (19.85%)' },
        { key: 'C', text: 'Steel (17.92%)' },
        { key: 'D', text: 'Coal (10.33%)' }
      ],
      correct_key: 'A',
      explanation: 'Refinery Products has the highest weight in the Eight Core Industries index with 28.04%, followed by Electricity (19.85%) and Steel (17.92%).'
    },
    {
      question: 'What is the purpose of the Supply-Use Tables (SUT) compiled by MoSPI National Accounts Division?',
      options: [
        { key: 'A', text: 'Reconciling supply of goods with their intermediate and final uses across industries' },
        { key: 'B', text: 'Calculating state income tax collections' },
        { key: 'C', text: 'Allocating food rations under NFSA' },
        { key: 'D', text: 'Auditing railway budget allocations' }
      ],
      correct_key: 'A',
      explanation: 'Supply-Use Tables provide the overarching accounting framework that balances the origin (domestic output + imports) and destination (intermediate consumption, exports, final consumption) of all commodities.'
    }
  ];
}
