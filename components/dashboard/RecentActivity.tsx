'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PracticeRecord } from '@/lib/types';
import { Clock, ArrowUpRight, CheckCircle2, RotateCcw } from 'lucide-react';

interface RecentActivityProps {
  records: PracticeRecord[];
  onOpenReattemptModal?: (record: PracticeRecord) => void;
}

export function RecentActivity({ records, onOpenReattemptModal }: RecentActivityProps) {
  const recentRecords = records.slice(0, 10);

  if (recentRecords.length === 0) {
    return (
      <Card className="text-center py-8">
        <p className="text-gray-500 text-sm">No practice questions logged yet.</p>
      </Card>
    );
  }

  return (
    <Card className="p-0 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900">Recent Practice Logs</h3>
          <p className="text-xs text-gray-500">Last {recentRecords.length} recorded attempts</p>
        </div>
        <Link
          href="/history"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
        >
          View all logs <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-gray-100">
        {recentRecords.map((record) => {
          const dateStr = new Date(record.createdAt).toLocaleDateString('en-IN', {
            month: 'short',
            day: 'numeric',
          });

          return (
            <div
              key={record.id}
              className="px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
            >
              <div className="flex items-start gap-3">
                <Badge variant="section" value={record.section}>
                  {record.section}
                </Badge>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-gray-900">{record.topic}</span>
                    {record.subtopic && (
                      <span className="text-xs text-gray-400">• {record.subtopic}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span className="font-medium text-gray-700">{record.source}</span>
                    {record.mockName && <span>({record.mockName})</span>}
                    <span>• {dateStr}</span>
                    {record.errorCategory && (
                      <span className="text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded text-[11px]">
                        {record.errorCategory}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{record.timeTaken}s</span>
                </div>

                <Badge variant="outcome" value={record.outcome}>
                  {record.outcome}
                </Badge>

                {record.outcome !== 'Correct' && (
                  record.hasReattempted ? (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Reattempted
                    </span>
                  ) : onOpenReattemptModal ? (
                    <button
                      onClick={() => onOpenReattemptModal(record)}
                      className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:bg-indigo-50 px-2 py-0.5 rounded-md transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" /> Reattempt
                    </button>
                  ) : (
                    <Link
                      href="/reattempts"
                      className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium hover:bg-indigo-50 px-2 py-0.5 rounded-md transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" /> Reattempt
                    </Link>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
