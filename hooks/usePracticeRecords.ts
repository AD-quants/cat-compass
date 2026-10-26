'use client';

import { useState, useEffect, useCallback } from 'react';
import { PracticeRecord, ReattemptRecord, AppPreferences } from '@/lib/types';
import * as storage from '@/lib/storage';
import { DEMO_PRACTICE_RECORDS, DEMO_REATTEMPT_RECORDS } from '@/lib/demo-data';

export function usePracticeRecords() {
  const [records, setRecords] = useState<PracticeRecord[]>([]);
  const [reattempts, setReattempts] = useState<ReattemptRecord[]>([]);
  const [prefs, setPrefs] = useState<AppPreferences>({ hasDemoData: false, onboardingComplete: false });
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync from storage on mount
  const refreshFromStorage = useCallback(() => {
    if (typeof window === 'undefined') return;
    const loadedRecords = storage.getRecords();
    const loadedReattempts = storage.getReattempts();
    const loadedPrefs = storage.getPrefs();

    setRecords(loadedRecords);
    setReattempts(loadedReattempts);
    setPrefs(loadedPrefs);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    refreshFromStorage();
  }, [refreshFromStorage]);

  // Listen to storage events across tabs/windows
  useEffect(() => {
    const handleStorageChange = () => {
      refreshFromStorage();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshFromStorage]);

  const addRecord = useCallback((recordData: Omit<PracticeRecord, 'id' | 'createdAt' | 'hasReattempted'> & { id?: string; createdAt?: string }) => {
    const newRecord: PracticeRecord = {
      ...recordData,
      id: recordData.id || `pr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: recordData.createdAt || new Date().toISOString(),
      hasReattempted: false,
    };
    storage.saveRecord(newRecord);
    setRecords((prev) => [newRecord, ...prev]);
    return newRecord;
  }, []);

  const updateRecord = useCallback((id: string, updates: Partial<PracticeRecord>) => {
    storage.updateRecord(id, updates);
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  }, []);

  const deleteRecord = useCallback((id: string) => {
    storage.deleteRecord(id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
    setReattempts((prev) => prev.filter((re) => re.practiceRecordId !== id));
  }, []);

  const addReattempt = useCallback((reattemptData: Omit<ReattemptRecord, 'id' | 'createdAt'> & { id?: string; createdAt?: string }) => {
    const newReattempt: ReattemptRecord = {
      ...reattemptData,
      id: reattemptData.id || `re-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: reattemptData.createdAt || new Date().toISOString(),
    };
    storage.saveReattempt(newReattempt);

    setReattempts((prev) => [newReattempt, ...prev]);
    setRecords((prev) =>
      prev.map((r) =>
        r.id === newReattempt.practiceRecordId
          ? { ...r, hasReattempted: true, reattemptId: newReattempt.id }
          : r
      )
    );
    return newReattempt;
  }, []);

  const loadDemoData = useCallback(() => {
    // Save demo records & reattempts to localStorage
    const currentRecords = storage.getRecords().filter((r) => !r.isDemo);
    const combinedRecords = [...DEMO_PRACTICE_RECORDS, ...currentRecords];
    localStorage.setItem('cat-compass-records', JSON.stringify(combinedRecords));

    const currentReattempts = storage.getReattempts().filter((r) => !r.isDemo);
    const combinedReattempts = [...DEMO_REATTEMPT_RECORDS, ...currentReattempts];
    localStorage.setItem('cat-compass-reattempts', JSON.stringify(combinedReattempts));

    const updatedPrefs: AppPreferences = { ...storage.getPrefs(), hasDemoData: true };
    storage.savePrefs(updatedPrefs);

    setRecords(combinedRecords);
    setReattempts(combinedReattempts);
    setPrefs(updatedPrefs);
  }, []);

  const clearDemoData = useCallback(() => {
    storage.clearDemoData();
    refreshFromStorage();
  }, [refreshFromStorage]);

  const resetAll = useCallback(() => {
    storage.resetAllData();
    setRecords([]);
    setReattempts([]);
    setPrefs({ hasDemoData: false, onboardingComplete: false });
  }, []);

  const bulkImportRecords = useCallback((newRecords: PracticeRecord[]) => {
    const currentRecords = storage.getRecords();
    const combined = [...newRecords, ...currentRecords];
    localStorage.setItem('cat-compass-records', JSON.stringify(combined));
    setRecords(combined);
  }, []);

  return {
    records,
    reattempts,
    prefs,
    isLoaded,
    addRecord,
    updateRecord,
    deleteRecord,
    addReattempt,
    loadDemoData,
    clearDemoData,
    resetAll,
    bulkImportRecords,
    refreshFromStorage,
  };
}
