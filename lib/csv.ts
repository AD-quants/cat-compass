import { Confidence, ErrorCategory, Outcome, PracticeRecord, ReattemptRecord, Section } from './types';

// Escapes a single CSV field
function escapeCSVField(val: unknown): string {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Splits a CSV line handling quoted fields
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export const CSV_TEMPLATE = `source,mockName,section,topic,subtopic,errorCategory,outcome,timeTaken,expectedTime,confidence,notes
IMS Mock 4,SimCAT 4,Quant,Arithmetic - Percentages & Profit/Loss,Successive Discounts,Calculation Error,Incorrect,180,120,Medium,Calculation error in second step
Cracku Practice,Daily Drill 12,VARC,Parajumbles,4-Sentence TITA,Reading Comprehension,Incorrect,140,90,Low,Missed connector pronoun
TIME Mock 2,AIMCAT 2502,DILR,Arrangements (Linear/Circular),Circular Seating,Set Selection,Partial,360,270,Medium,Solved 2 of 4 questions`;

export function exportRecordsToCSV(records: PracticeRecord[]): string {
  const headers = [
    'id',
    'createdAt',
    'source',
    'mockName',
    'section',
    'topic',
    'subtopic',
    'errorCategory',
    'outcome',
    'timeTaken',
    'expectedTime',
    'confidence',
    'notes',
    'hasReattempted',
    'isDemo',
  ];

  const rows = records.map((r) =>
    [
      escapeCSVField(r.id),
      escapeCSVField(r.createdAt),
      escapeCSVField(r.source),
      escapeCSVField(r.mockName),
      escapeCSVField(r.section),
      escapeCSVField(r.topic),
      escapeCSVField(r.subtopic || ''),
      escapeCSVField(r.errorCategory || ''),
      escapeCSVField(r.outcome),
      escapeCSVField(r.timeTaken),
      escapeCSVField(r.expectedTime),
      escapeCSVField(r.confidence),
      escapeCSVField(r.notes || ''),
      escapeCSVField(r.hasReattempted),
      escapeCSVField(r.isDemo),
    ].join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}

export function exportReattemptsToCSV(reattempts: ReattemptRecord[]): string {
  const headers = ['id', 'practiceRecordId', 'createdAt', 'result', 'timeTaken', 'notes', 'isDemo'];
  const rows = reattempts.map((r) =>
    [
      escapeCSVField(r.id),
      escapeCSVField(r.practiceRecordId),
      escapeCSVField(r.createdAt),
      escapeCSVField(r.result),
      escapeCSVField(r.timeTaken),
      escapeCSVField(r.notes || ''),
      escapeCSVField(r.isDemo),
    ].join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}

export function parseCSV(content: string): { records: Partial<PracticeRecord>[]; errors: string[] } {
  const lines = content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    return { records: [], errors: ['CSV file is empty or missing data rows.'] };
  }

  const rawHeaders = parseCSVLine(lines[0]).map((h) => h.toLowerCase().replace(/[\s_-]+/g, ''));
  const records: Partial<PracticeRecord>[] = [];
  const errors: string[] = [];

  const validSections: Section[] = ['VARC', 'DILR', 'Quant'];
  const validOutcomes: Outcome[] = ['Correct', 'Incorrect', 'Skipped', 'Partial'];
  const validConfidences: Confidence[] = ['High', 'Medium', 'Low'];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0 || (values.length === 1 && values[0] === '')) continue;

    const rowObj: Record<string, string> = {};
    rawHeaders.forEach((h, idx) => {
      rowObj[h] = values[idx] || '';
    });

    const lineNum = i + 1;

    // Validate required fields
    const source = rowObj['source'] || rowObj['sourcename'];
    const mockName = rowObj['mockname'] || rowObj['mock'] || '';
    const rawSection = (rowObj['section'] || '').toUpperCase();
    const section = validSections.find((s) => s.toUpperCase() === rawSection);
    const topic = rowObj['topic'];
    const subtopic = rowObj['subtopic'] || '';
    const errorCategory = (rowObj['errorcategory'] || rowObj['category'] || undefined) as
      | ErrorCategory
      | undefined;

    const rawOutcome = rowObj['outcome'] || 'Incorrect';
    const outcome = validOutcomes.find((o) => o.toLowerCase() === rawOutcome.toLowerCase()) as Outcome;

    const timeTaken = parseInt(rowObj['timetaken'] || rowObj['time'] || '0', 10);
    const expectedTime = parseInt(rowObj['expectedtime'] || '120', 10);

    const rawConf = rowObj['confidence'] || 'Medium';
    const confidence = (validConfidences.find((c) => c.toLowerCase() === rawConf.toLowerCase()) ||
      'Medium') as Confidence;

    const notes = rowObj['notes'] || '';

    if (!source) {
      errors.push(`Row ${lineNum}: Missing source.`);
      continue;
    }
    if (!section) {
      errors.push(`Row ${lineNum}: Invalid or missing section "${rowObj['section']}". Expected VARC, DILR, or Quant.`);
      continue;
    }
    if (!topic) {
      errors.push(`Row ${lineNum}: Missing topic.`);
      continue;
    }
    if (!outcome) {
      errors.push(`Row ${lineNum}: Invalid outcome "${rowObj['outcome']}". Expected Correct, Incorrect, Skipped, or Partial.`);
      continue;
    }

    records.push({
      id: rowObj['id'] || undefined,
      createdAt: rowObj['createdat'] || new Date().toISOString(),
      source,
      mockName,
      section,
      topic,
      subtopic: subtopic || undefined,
      errorCategory: errorCategory || undefined,
      outcome,
      timeTaken: isNaN(timeTaken) || timeTaken <= 0 ? 60 : timeTaken,
      expectedTime: isNaN(expectedTime) || expectedTime <= 0 ? 120 : expectedTime,
      confidence,
      notes,
      hasReattempted: rowObj['hasreattempted'] === 'true',
      isDemo: false,
    });
  }

  return { records, errors };
}

export function downloadCSV(filename: string, content: string): void {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
