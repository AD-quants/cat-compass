'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePracticeRecords } from '@/hooks/usePracticeRecords';
import { PendingReattemptCard, CompletedReattemptCard } from '@/components/reattempts/ReattemptCard';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { PracticeRecord, ReattemptResult, Section } from '@/lib/types';
import { RotateCcw, CheckCircle2, Clock, AlertCircle, Sparkles, Filter } from 'lucide-react';

export default function ReattemptsPage() {
  const { records, reattempts, isLoaded, addReattempt } = usePracticeRecords();
  const { success } = useToast();

  const [activeSectionFilter, setActiveSectionFilter] = useState<string>('ALL');
  const [selectedRecordForReattempt, setSelectedRecordForReattempt] = useState<PracticeRecord | null>(null);

  // Form states for Modal
  const [reattemptResult, setReattemptResult] = useState<ReattemptResult>('Solved Independently');
  const [reattemptTime, setReattemptTime] = useState<string>('90');
  const [reattemptNotes, setReattemptNotes] = useState<string>('');

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Pending questions: outcome != Correct and !hasReattempted
  const pendingRecords = records.filter(
    (r) =>
      r.outcome !== 'Correct' &&
      !r.hasReattempted &&
      (activeSectionFilter === 'ALL' || r.section === activeSectionFilter)
  );

  // Completed reattempts
  const completedList = reattempts.filter((re) => {
    if (activeSectionFilter === 'ALL') return true;
    const parentRecord = records.find((r) => r.id === re.practiceRecordId);
    return parentRecord?.section === activeSectionFilter;
  });

  const handleOpenModal = (record: PracticeRecord) => {
    setSelectedRecordForReattempt(record);
    setReattemptResult('Solved Independently');
    setReattemptTime(record.expectedTime ? String(record.expectedTime) : '90');
    setReattemptNotes('');
  };

  const handleCloseModal = () => {
    setSelectedRecordForReattempt(null);
  };

  const handleSubmitReattempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecordForReattempt) return;

    const time = parseInt(reattemptTime, 10);
    addReattempt({
      practiceRecordId: selectedRecordForReattempt.id,
      result: reattemptResult,
      timeTaken: isNaN(time) || time <= 0 ? 60 : time,
      notes: reattemptNotes.trim(),
      isDemo: false,
    });

    success('Reattempt recorded successfully!');
    handleCloseModal();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs tracking-wider uppercase">
            <RotateCcw className="w-4 h-4" />
            <span>Mastery Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
            Reattempt & Improvement Tracker
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            A mistake isn't resolved when you read the solution—it's resolved when you solve it yourself under timed conditions.
          </p>
        </div>

        {/* Section Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-gray-200 rounded-xl">
          {['ALL', 'VARC', 'DILR', 'Quant'].map((sec) => (
            <button
              key={sec}
              onClick={() => setActiveSectionFilter(sec)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeSectionFilter === sec
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-100'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Pending Reattempts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="text-base font-bold text-gray-900">
                Pending Reattempts ({pendingRecords.length})
              </h2>
            </div>
            <span className="text-xs text-gray-400">Mistakes awaiting follow-up</span>
          </div>

          {pendingRecords.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-gray-100">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-800 text-sm">No Pending Reattempts!</h4>
              <p className="text-xs text-gray-500 mt-1">
                You have reattempted all logged mistakes for this filter. Outstanding consistency!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRecords.map((rec) => (
                <PendingReattemptCard
                  key={rec.id}
                  record={rec}
                  onOpenReattemptModal={handleOpenModal}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Completed Reattempts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h2 className="text-base font-bold text-gray-900">
                Completed Reattempts ({completedList.length})
              </h2>
            </div>
            <span className="text-xs text-gray-400">Verified progress</span>
          </div>

          {completedList.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-gray-100">
              <Clock className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-800 text-sm">No Completed Reattempts Yet</h4>
              <p className="text-xs text-gray-500 mt-1">
                Once you reattempt questions from the left column, your verified attempts and speed improvements will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedList.map((re) => {
                const parent = records.find((r) => r.id === re.practiceRecordId);
                return (
                  <CompletedReattemptCard
                    key={re.id}
                    reattempt={re}
                    practiceRecord={parent}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal: Log Reattempt */}
      {selectedRecordForReattempt && (
        <Modal
          isOpen={!!selectedRecordForReattempt}
          onClose={handleCloseModal}
          title="Log Question Reattempt"
          description={`Record your second attempt for ${selectedRecordForReattempt.topic}`}
        >
          <form onSubmit={handleSubmitReattempt} className="space-y-4">
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 text-xs text-gray-600 space-y-1">
              <div className="font-semibold text-gray-800">{selectedRecordForReattempt.topic}</div>
              <div>
                Original Outcome: <span className="font-medium text-rose-600">{selectedRecordForReattempt.outcome}</span>
              </div>
              {selectedRecordForReattempt.notes && (
                <div className="italic text-gray-500 mt-1">"{selectedRecordForReattempt.notes}"</div>
              )}
            </div>

            <Select
              label="Reattempt Outcome"
              value={reattemptResult}
              onChange={(e) => setReattemptResult(e.target.value as ReattemptResult)}
              required
            >
              <option value="Solved Independently">Solved Independently (Full Mastery)</option>
              <option value="Needed Hint">Needed Hint (Partial Mastery)</option>
              <option value="Could Not Solve">Could Not Solve (Concept Still Weak)</option>
            </Select>

            <Input
              label="Time Taken (seconds)"
              type="number"
              min="1"
              value={reattemptTime}
              onChange={(e) => setReattemptTime(e.target.value)}
              required
              helperText={`Original time: ${selectedRecordForReattempt.timeTaken}s (Target: ${selectedRecordForReattempt.expectedTime}s)`}
            />

            <Textarea
              label="Reattempt Reflections"
              placeholder="Did you spot the trap faster? What was the breakthrough insight?"
              value={reattemptNotes}
              onChange={(e) => setReattemptNotes(e.target.value)}
              rows={3}
            />

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <Button type="button" variant="ghost" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Reattempt
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
