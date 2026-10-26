export type Section = 'VARC' | 'DILR' | 'Quant';

export type ErrorCategory =
  | 'Calculation Error'
  | 'Concept Gap'
  | 'Time Management'
  | 'Silly Mistake'
  | 'Set Selection'
  | 'Reading Comprehension'
  | 'Misread Question'
  | 'Lack of Practice'
  | 'Other';

export type Outcome = 'Correct' | 'Incorrect' | 'Skipped' | 'Partial';

export type Confidence = 'High' | 'Medium' | 'Low';

export type ReattemptResult = 'Solved Independently' | 'Needed Hint' | 'Could Not Solve';

export interface PracticeRecord {
  id: string;
  createdAt: string;
  source: string;
  mockName: string;
  section: Section;
  topic: string;
  subtopic?: string;
  errorCategory?: ErrorCategory;
  outcome: Outcome;
  timeTaken: number;       // seconds
  expectedTime: number;    // seconds
  confidence: Confidence;
  notes: string;
  hasReattempted: boolean;
  reattemptId?: string;
  isDemo: boolean;
}

export interface ReattemptRecord {
  id: string;
  practiceRecordId: string;
  createdAt: string;
  result: ReattemptResult;
  timeTaken: number;
  notes: string;
  isDemo: boolean;
}

export interface Weakness {
  section: Section;
  topic: string;
  errorCategory?: ErrorCategory;
  occurrences: number;
  unresolvedCount: number;
  avgTimeLost: number;
  lastSeen: string;
  priorityScore: number;
  reason: string;
}

export interface AppPreferences {
  hasDemoData: boolean;
  onboardingComplete: boolean;
}

export interface SectionTopics {
  [key: string]: string[];
}

export const SECTION_TOPICS: Record<Section, string[]> = {
  VARC: [
    'Reading Comprehension',
    'Parajumbles',
    'Para Summary',
    'Odd Sentence Out',
    'Critical Reasoning',
    'Sentence Completion',
  ],
  DILR: [
    'Arrangements (Linear/Circular)',
    'Matrix & Grid Logic',
    'Games & Tournaments',
    'Binary Logic',
    'Charts & Graphs (Bar/Line/Pie)',
    'Data Tables & Missing Data',
    'Venn Diagrams & Set Theory',
    'Network & Scheduling',
  ],
  Quant: [
    'Arithmetic - Percentages & Profit/Loss',
    'Arithmetic - Ratio & Proportions',
    'Arithmetic - Time, Speed & Distance',
    'Arithmetic - Time & Work',
    'Arithmetic - Averages & Mixtures',
    'Algebra - Linear & Quadratic Equations',
    'Algebra - Functions & Graphs',
    'Algebra - Logarithms & Indices',
    'Algebra - Progressions (AP/GP)',
    'Geometry - Triangles & Circles',
    'Geometry - Mensuration & Coordinate',
    'Number Systems',
    'Modern Math - Permutations & Combinations',
    'Modern Math - Probability',
  ],
};

export const ERROR_CATEGORIES: ErrorCategory[] = [
  'Calculation Error',
  'Concept Gap',
  'Time Management',
  'Silly Mistake',
  'Set Selection',
  'Reading Comprehension',
  'Misread Question',
  'Lack of Practice',
  'Other',
];
