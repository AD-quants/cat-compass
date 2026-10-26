import { AppPreferences, PracticeRecord, ReattemptRecord } from './types';

const STORAGE_KEYS = {
  RECORDS: 'cat-compass-records',
  REATTEMPTS: 'cat-compass-reattempts',
  PREFS: 'cat-compass-prefs',
};

const DEFAULT_PREFS: AppPreferences = {
  hasDemoData: false,
  onboardingComplete: false,
};

export function getRecords(): PracticeRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECORDS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to get records from localStorage:', err);
    return [];
  }
}

export function saveRecord(record: PracticeRecord): void {
  if (typeof window === 'undefined') return;
  try {
    const records = getRecords();
    const existingIndex = records.findIndex((r) => r.id === record.id);
    if (existingIndex >= 0) {
      records[existingIndex] = record;
    } else {
      records.unshift(record);
    }
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save record to localStorage:', err);
  }
}

export function updateRecord(id: string, updates: Partial<PracticeRecord>): void {
  if (typeof window === 'undefined') return;
  try {
    const records = getRecords();
    const index = records.findIndex((r) => r.id === id);
    if (index !== -1) {
      records[index] = { ...records[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
    }
  } catch (err) {
    console.error('Failed to update record in localStorage:', err);
  }
}

export function deleteRecord(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const records = getRecords().filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));

    // Also remove associated reattempts
    const reattempts = getReattempts().filter((re) => re.practiceRecordId !== id);
    localStorage.setItem(STORAGE_KEYS.REATTEMPTS, JSON.stringify(reattempts));
  } catch (err) {
    console.error('Failed to delete record from localStorage:', err);
  }
}

export function getReattempts(): ReattemptRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REATTEMPTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to get reattempts from localStorage:', err);
    return [];
  }
}

export function saveReattempt(reattempt: ReattemptRecord): void {
  if (typeof window === 'undefined') return;
  try {
    const reattempts = getReattempts();
    const existingIndex = reattempts.findIndex((r) => r.id === reattempt.id);
    if (existingIndex >= 0) {
      reattempts[existingIndex] = reattempt;
    } else {
      reattempts.unshift(reattempt);
    }
    localStorage.setItem(STORAGE_KEYS.REATTEMPTS, JSON.stringify(reattempts));

    // Update parent record to mark as reattempted
    updateRecord(reattempt.practiceRecordId, {
      hasReattempted: true,
      reattemptId: reattempt.id,
    });
  } catch (err) {
    console.error('Failed to save reattempt to localStorage:', err);
  }
}

export function getPrefs(): AppPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFS);
    if (!raw) return DEFAULT_PREFS;
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to get preferences from localStorage:', err);
    return DEFAULT_PREFS;
  }
}

export function savePrefs(prefs: AppPreferences): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(prefs));
  } catch (err) {
    console.error('Failed to save preferences to localStorage:', err);
  }
}

export function clearDemoData(): void {
  if (typeof window === 'undefined') return;
  try {
    const records = getRecords().filter((r) => !r.isDemo);
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));

    const reattempts = getReattempts().filter((r) => !r.isDemo);
    localStorage.setItem(STORAGE_KEYS.REATTEMPTS, JSON.stringify(reattempts));

    const prefs = getPrefs();
    savePrefs({ ...prefs, hasDemoData: false });
  } catch (err) {
    console.error('Failed to clear demo data from localStorage:', err);
  }
}

export function resetAllData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.RECORDS);
    localStorage.removeItem(STORAGE_KEYS.REATTEMPTS);
    localStorage.removeItem(STORAGE_KEYS.PREFS);
  } catch (err) {
    console.error('Failed to reset all data:', err);
  }
}
