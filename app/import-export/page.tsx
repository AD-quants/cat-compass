'use client';

import React, { useState, useRef } from 'react';
import { usePracticeRecords } from '@/hooks/usePracticeRecords';
import {
  exportRecordsToCSV,
  exportReattemptsToCSV,
  downloadCSV,
  parseCSV,
  CSV_TEMPLATE,
} from '@/lib/csv';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { PracticeRecord } from '@/lib/types';
import {
  Download,
  Upload,
  FileSpreadsheet,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Sparkles,
  FileText,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export default function ImportExportPage() {
  const {
    records,
    reattempts,
    bulkImportRecords,
    loadDemoData,
    clearDemoData,
    resetAll,
  } = usePracticeRecords();

  const { success, error: toastError, info } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importedPreview, setImportedPreview] = useState<Partial<PracticeRecord>[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetConfirmInput, setResetConfirmInput] = useState('');

  // 1. Export Handlers
  const handleExportRecords = () => {
    if (records.length === 0) {
      toastError('No records to export yet.');
      return;
    }
    const csvData = exportRecordsToCSV(records);
    const dateStr = new Date().toISOString().split('T')[0];
    downloadCSV(`cat-compass-practice-records-${dateStr}.csv`, csvData);
    success('Practice records CSV downloaded!');
  };

  const handleExportReattempts = () => {
    if (reattempts.length === 0) {
      toastError('No reattempts to export yet.');
      return;
    }
    const csvData = exportReattemptsToCSV(reattempts);
    const dateStr = new Date().toISOString().split('T')[0];
    downloadCSV(`cat-compass-reattempts-${dateStr}.csv`, csvData);
    success('Reattempts CSV downloaded!');
  };

  const handleDownloadTemplate = () => {
    downloadCSV('cat-compass-import-template.csv', CSV_TEMPLATE);
    info('CSV import template downloaded.');
  };

  // 2. Import Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) {
        toastError('Could not read the uploaded file.');
        return;
      }

      const { records: parsedRecords, errors } = parseCSV(content);
      setImportedPreview(parsedRecords);
      setImportErrors(errors);

      if (errors.length > 0) {
        toastError(`Found ${errors.length} issue(s) while parsing CSV.`);
      } else {
        success(`Parsed ${parsedRecords.length} records ready for import.`);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (importedPreview.length === 0) return;

    // Convert partials to full records
    const fullRecords: PracticeRecord[] = importedPreview.map((item) => ({
      id: item.id || `imp-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: item.createdAt || new Date().toISOString(),
      source: item.source || 'Imported Practice',
      mockName: item.mockName || '',
      section: item.section || 'Quant',
      topic: item.topic || 'General',
      subtopic: item.subtopic,
      errorCategory: item.errorCategory,
      outcome: item.outcome || 'Incorrect',
      timeTaken: item.timeTaken || 120,
      expectedTime: item.expectedTime || 120,
      confidence: item.confidence || 'Medium',
      notes: item.notes || '',
      hasReattempted: !!item.hasReattempted,
      isDemo: false,
    }));

    bulkImportRecords(fullRecords);
    success(`Successfully imported ${fullRecords.length} records!`);

    // Reset preview
    setImportedPreview([]);
    setImportErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearPreview = () => {
    setImportedPreview([]);
    setImportErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 3. Reset Handler
  const handleConfirmReset = () => {
    if (resetConfirmInput.trim() !== 'RESET') {
      toastError('Please type RESET in all caps to confirm.');
      return;
    }
    resetAll();
    setIsResetModalOpen(false);
    setResetConfirmInput('');
    success('All application data has been completely reset.');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs tracking-wider uppercase">
          <FileSpreadsheet className="w-4 h-4" />
          <span>Data Portability & Controls</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
          Import, Export & Data Management
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Your preparation data belongs entirely to you. Export clean spreadsheets, import questions from Excel or CSV, or manage demo datasets.
        </p>
      </div>

      {/* SECTION 1: Export Data */}
      <Card>
        <div className="flex items-start justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Download className="w-5 h-5 text-indigo-600" /> Export Practice Records
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Download your complete preparation logs into standard CSV format, compatible with Microsoft Excel, Google Sheets, or Notion.
            </p>
          </div>
          <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1 rounded-full border border-indigo-100">
            {records.length} records • {reattempts.length} reattempts
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col justify-between">
            <div>
              <h4 className="font-semibold text-gray-800 text-sm">Practice Questions CSV</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Includes all question entries: section, topic, subtopic, source, mock name, time spent, confidence rating, error tag, and personal notes.
              </p>
            </div>
            <div className="mt-4">
              <Button
                variant="primary"
                size="sm"
                onClick={handleExportRecords}
                disabled={records.length === 0}
              >
                <Download className="w-4 h-4 mr-1.5" /> Download Practice Logs ({records.length})
              </Button>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col justify-between">
            <div>
              <h4 className="font-semibold text-gray-800 text-sm">Reattempts & Improvements CSV</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Includes verified reattempt records: result outcome (Solved / Hint / Failed), reattempt duration, and improvement reflections.
              </p>
            </div>
            <div className="mt-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExportReattempts}
                disabled={reattempts.length === 0}
              >
                <Download className="w-4 h-4 mr-1.5" /> Download Reattempts ({reattempts.length})
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* SECTION 2: Import Data */}
      <Card>
        <div className="flex items-start justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-600" /> Import Questions via CSV
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Upload existing spreadsheets of questions solved from past mocks, coaching sheets, or study trackers.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleDownloadTemplate} className="text-xs">
            <FileText className="w-3.5 h-3.5 mr-1 text-indigo-600" /> Download Template
          </Button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors bg-gray-50/30">
            <Upload className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-800">Select a CSV file to import</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Must include columns: source, section (VARC/DILR/Quant), topic, outcome, timeTaken
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="mt-4 text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
            />
          </div>

          {/* Errors list if any */}
          {importErrors.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900">
              <div className="flex items-center gap-2 font-bold mb-1">
                <AlertTriangle className="w-4 h-4 text-rose-600" /> Validation Warnings ({importErrors.length})
              </div>
              <ul className="list-disc list-inside space-y-0.5 max-h-32 overflow-y-auto">
                {importErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Preview of Parsed Records */}
          {importedPreview.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-900">
                  Import Preview ({importedPreview.length} questions parsed)
                </h4>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={handleClearPreview} className="text-xs">
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleConfirmImport}>
                    <CheckCircle2 className="w-4 h-4 mr-1.5" /> Confirm Import ({importedPreview.length})
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto max-h-60 border border-gray-200 rounded-lg">
                <table className="w-full text-left text-xs text-gray-600">
                  <thead className="bg-gray-50 sticky top-0 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="px-3 py-2">Section</th>
                      <th className="px-3 py-2">Topic</th>
                      <th className="px-3 py-2">Source</th>
                      <th className="px-3 py-2">Outcome</th>
                      <th className="px-3 py-2">Time</th>
                      <th className="px-3 py-2">Error Category</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {importedPreview.slice(0, 10).map((p, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-3 py-2 font-medium">{p.section}</td>
                        <td className="px-3 py-2">{p.topic}</td>
                        <td className="px-3 py-2">{p.source}</td>
                        <td className="px-3 py-2 font-semibold">{p.outcome}</td>
                        <td className="px-3 py-2">{p.timeTaken}s</td>
                        <td className="px-3 py-2">{p.errorCategory || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {importedPreview.length > 10 && (
                <p className="text-xs text-gray-400 text-center">
                  Showing first 10 of {importedPreview.length} questions
                </p>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* SECTION 3: Data Controls */}
      <Card className="border-rose-100">
        <div className="pb-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-gray-700" /> Data Controls & Demo Management
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Load realistic prep profiles for instant demonstration, remove demo samples, or perform a total factory reset.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Load Demo Data */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex flex-col justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Load Demo Dataset</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Populates 30 realistic practice questions and 10 verified reattempts across IMS, TIME, and Cracku mocks.
              </p>
            </div>
            <div className="mt-4">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  loadDemoData();
                  success('Loaded 30 demo questions & 10 reattempts!');
                }}
              >
                <Sparkles className="w-4 h-4 mr-1.5" /> Load Demo Data
              </Button>
            </div>
          </div>

          {/* Clear Demo Data */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex flex-col justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Remove Demo Records</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Cleans out all pre-populated sample records while strictly preserving your own custom logged data.
              </p>
            </div>
            <div className="mt-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  clearDemoData();
                  info('Demo data removed.');
                }}
              >
                <RotateCcw className="w-4 h-4 mr-1.5" /> Clear Demo Data
              </Button>
            </div>
          </div>

          {/* Reset All Data */}
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 flex flex-col justify-between">
            <div>
              <h4 className="font-semibold text-rose-900 text-sm">Reset All Data</h4>
              <p className="text-xs text-rose-700/80 mt-1 leading-relaxed">
                Permanently wipes all practice records, reattempts, and preferences from browser localStorage.
              </p>
            </div>
            <div className="mt-4">
              <Button
                variant="danger"
                size="sm"
                onClick={() => setIsResetModalOpen(true)}
              >
                <Trash2 className="w-4 h-4 mr-1.5" /> Reset All Data
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Modal: Confirm Full Reset */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => {
          setIsResetModalOpen(false);
          setResetConfirmInput('');
        }}
        title="Permanently Reset All Data?"
        description="This action cannot be undone. All your practice questions, error logs, and reattempts will be deleted."
      >
        <div className="space-y-4">
          <div className="p-3 bg-rose-50 rounded-lg text-rose-900 text-xs border border-rose-200">
            To prevent accidental deletion, please type <strong>RESET</strong> in the box below.
          </div>

          <Input
            label="Confirmation Phrase"
            placeholder="Type RESET"
            value={resetConfirmInput}
            onChange={(e) => setResetConfirmInput(e.target.value)}
          />

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            <Button
              variant="ghost"
              onClick={() => {
                setIsResetModalOpen(false);
                setResetConfirmInput('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              disabled={resetConfirmInput.trim() !== 'RESET'}
              onClick={handleConfirmReset}
            >
              Wipe Everything
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
