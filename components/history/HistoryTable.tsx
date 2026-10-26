'use client';

import React, { useState } from 'react';
import { PracticeRecord, ReattemptRecord, ReattemptResult } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/components/ui/Toast';
import { Clock, RotateCcw, Trash2, CheckCircle2, ChevronRight, Eye } from 'lucide-react';

interface HistoryTableProps {
  records: PracticeRecord[];
  reattempts: ReattemptRecord[];
  onDeleteRecord: (id: string) => void;
  onAddReattempt: (data: Omit<ReattemptRecord, 'id' | 'createdAt'>) => void;
}

export function HistoryTable({
  records,
  reattempts,
  onDeleteRecord,
  onAddReattempt,
}: HistoryTableProps) {
  const { success } = useToast();

  // Modal states
  const [selectedRecordForReattempt, setSelectedRecordForReattempt] = useState<PracticeRecord | null>(null);
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState<PracticeRecord | null>(null);

  // Form states for Reattempt Modal
  const [reattemptResult, setReattemptResult] = useState<ReattemptResult>('Solved Independently');
  const [reattemptTime, setReattemptTime] = useState<string>('90');
  const [reattemptNotes, setReattemptNotes] = useState<string>('');

  const handleOpenReattempt = (record: PracticeRecord) => {
    setSelectedRecordForReattempt(record);
    setReattemptResult('Solved Independently');
    setReattemptTime(record.expectedTime ? String(record.expectedTime) : '90');
    setReattemptNotes('');
  };

  const handleCloseReattempt = () => {
    setSelectedRecordForReattempt(null);
  };

  const handleSubmitReattempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecordForReattempt) return;

    const time = parseInt(reattemptTime, 10);
    onAddReattempt({
      practiceRecordId: selectedRecordForReattempt.id,
      result: reattemptResult,
      timeTaken: isNaN(time) || time <= 0 ? 60 : time,
      notes: reattemptNotes.trim(),
      isDemo: false,
    });

    success('Reattempt recorded successfully!');
    handleCloseReattempt();
  };

  const handleDelete = (id: string, topic: string) => {
    if (typeof window !== 'undefined' && window.confirm(`Are you sure you want to delete the record for "${topic}"?`)) {
      onDeleteRecord(id);
      success('Record deleted.');
    }
  };

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
        <p className="text-gray-500 text-sm">No practice records found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50/75 text-xs uppercase text-gray-500 font-semibold border-b border-gray-100">
            <tr>
              <th scope="col" className="px-5 py-3.5">Date</th>
              <th scope="col" className="px-5 py-3.5">Section</th>
              <th scope="col" className="px-5 py-3.5">Topic & Concept</th>
              <th scope="col" className="px-5 py-3.5">Source & Mock</th>
              <th scope="col" className="px-5 py-3.5">Outcome</th>
              <th scope="col" className="px-5 py-3.5">Time</th>
              <th scope="col" className="px-5 py-3.5">Error Cause</th>
              <th scope="col" className="px-5 py-3.5">Reattempt</th>
              <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {records.map((r) => {
              const dateStr = new Date(r.createdAt).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
              });

              // Associated reattempt if exists
              const reattempt = reattempts.find((re) => re.practiceRecordId === r.id);

              return (
                <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Date */}
                  <td className="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                    {dateStr}
                  </td>

                  {/* Section */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <Badge variant="section" value={r.section} size="sm">
                      {r.section}
                    </Badge>
                  </td>

                  {/* Topic */}
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-gray-900 leading-snug">{r.topic}</div>
                    {r.subtopic && <div className="text-xs text-gray-400 mt-0.5">{r.subtopic}</div>}
                  </td>

                  {/* Source */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="font-medium text-gray-700 text-xs">{r.source}</div>
                    {r.mockName && <div className="text-[11px] text-gray-400">{r.mockName}</div>}
                  </td>

                  {/* Outcome */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <Badge variant="outcome" value={r.outcome} size="sm">
                      {r.outcome}
                    </Badge>
                  </td>

                  {/* Time */}
                  <td className="px-5 py-3.5 whitespace-nowrap text-xs">
                    <span className="font-medium text-gray-900">{r.timeTaken}s</span>
                    <span className="text-gray-400"> / {r.expectedTime}s</span>
                  </td>

                  {/* Error Category */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    {r.errorCategory ? (
                      <span className="text-xs font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                        {r.errorCategory}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>

                  {/* Reattempt */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    {r.outcome === 'Correct' ? (
                      <span className="text-xs text-emerald-600 font-medium">N/A</span>
                    ) : r.hasReattempted && reattempt ? (
                      <Badge variant="reattempt" value={reattempt.result} size="sm">
                        {reattempt.result}
                      </Badge>
                    ) : (
                      <button
                        onClick={() => handleOpenReattempt(r)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50/70 hover:bg-indigo-100/70 px-2 py-1 rounded transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" /> Log Reattempt
                      </button>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedRecordForDetail(r)}
                        title="View Details"
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id, r.topic)}
                        title="Delete Record"
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal: Log Reattempt */}
      {selectedRecordForReattempt && (
        <Modal
          isOpen={!!selectedRecordForReattempt}
          onClose={handleCloseReattempt}
          title="Log Question Reattempt"
          description={`Record your second attempt for ${selectedRecordForReattempt.topic}`}
        >
          <form onSubmit={handleSubmitReattempt} className="space-y-4">
            <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 text-xs text-gray-600 space-y-1">
              <div className="font-semibold text-gray-800">{selectedRecordForReattempt.topic}</div>
              <div>Original Outcome: <span className="font-medium text-rose-600">{selectedRecordForReattempt.outcome}</span></div>
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
              <Button type="button" variant="ghost" onClick={handleCloseReattempt}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Reattempt
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: View Details */}
      {selectedRecordForDetail && (
        <Modal
          isOpen={!!selectedRecordForDetail}
          onClose={() => setSelectedRecordForDetail(null)}
          title="Question Details & Analysis"
          description={`Logged on ${new Date(selectedRecordForDetail.createdAt).toLocaleString()}`}
        >
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-xs text-gray-400 block">Section & Topic</span>
                <span className="font-bold text-gray-900">{selectedRecordForDetail.section} • {selectedRecordForDetail.topic}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Source & Mock</span>
                <span className="font-semibold text-gray-800">{selectedRecordForDetail.source} {selectedRecordForDetail.mockName ? `(${selectedRecordForDetail.mockName})` : ''}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Outcome</span>
                <Badge variant="outcome" value={selectedRecordForDetail.outcome} size="sm">
                  {selectedRecordForDetail.outcome}
                </Badge>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Confidence</span>
                <span className="font-medium text-gray-800">{selectedRecordForDetail.confidence}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Time Spent vs Target</span>
                <span className="font-medium text-gray-800">{selectedRecordForDetail.timeTaken}s <span className="text-gray-400">/ {selectedRecordForDetail.expectedTime}s</span></span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Error Category</span>
                <span className="font-medium text-rose-600">{selectedRecordForDetail.errorCategory || 'None'}</span>
              </div>
            </div>

            {selectedRecordForDetail.notes && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Your Reflection</h4>
                <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 text-gray-800 text-sm italic">
                  "{selectedRecordForDetail.notes}"
                </div>
              </div>
            )}

            {/* If reattempted, display reattempt info */}
            {selectedRecordForDetail.hasReattempted && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Reattempt Summary</h4>
                {(() => {
                  const re = reattempts.find((r) => r.practiceRecordId === selectedRecordForDetail.id);
                  if (!re) return <p className="text-xs text-gray-400">Reattempt details not found.</p>;
                  return (
                    <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-100 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-emerald-900">Result: {re.result}</span>
                        <span className="text-gray-500">{re.timeTaken}s</span>
                      </div>
                      {re.notes && <p className="text-gray-700 italic">"{re.notes}"</p>}
                    </div>
                  );
                })()}
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-gray-100">
              <Button variant="secondary" onClick={() => setSelectedRecordForDetail(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
