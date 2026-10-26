'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PracticeRecord, ReattemptRecord } from '@/lib/types';
import { RotateCcw, Clock, CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

interface PendingReattemptCardProps {
  record: PracticeRecord;
  onOpenReattemptModal: (record: PracticeRecord) => void;
}

export function PendingReattemptCard({ record, onOpenReattemptModal }: PendingReattemptCardProps) {
  const dateStr = new Date(record.createdAt).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card hoverEffect className="border-l-4 border-l-amber-500">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="section" value={record.section} size="sm">
            {record.section}
          </Badge>
          <Badge variant="outcome" value={record.outcome} size="sm">
            {record.outcome}
          </Badge>
        </div>
        <span className="text-xs text-gray-400">{dateStr}</span>
      </div>

      <div className="mt-2.5">
        <h4 className="font-bold text-gray-900 text-sm">{record.topic}</h4>
        {record.subtopic && <p className="text-xs text-gray-500 mt-0.5">{record.subtopic}</p>}
      </div>

      <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
        <span>{record.source}</span>
        {record.mockName && <span>• {record.mockName}</span>}
      </div>

      {record.notes && (
        <div className="mt-3 p-2.5 bg-gray-50 rounded-lg text-xs text-gray-700 italic border border-gray-100">
          "{record.notes}"
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span>Took {record.timeTaken}s (Target: {record.expectedTime}s)</span>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => onOpenReattemptModal(record)}
          className="text-xs py-1"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" /> Log Reattempt
        </Button>
      </div>
    </Card>
  );
}

interface CompletedReattemptCardProps {
  reattempt: ReattemptRecord;
  practiceRecord?: PracticeRecord;
}

export function CompletedReattemptCard({ reattempt, practiceRecord }: CompletedReattemptCardProps) {
  const dateStr = new Date(reattempt.createdAt).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
  });

  const isSolved = reattempt.result === 'Solved Independently';
  const isHint = reattempt.result === 'Needed Hint';

  // Calculate speed improvement if practiceRecord is present
  const originalTime = practiceRecord?.timeTaken || 0;
  const timeDiff = originalTime > 0 ? originalTime - reattempt.timeTaken : 0;

  return (
    <Card
      hoverEffect
      className={`border-l-4 ${
        isSolved ? 'border-l-emerald-500' : isHint ? 'border-l-amber-500' : 'border-l-rose-500'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {practiceRecord && (
            <Badge variant="section" value={practiceRecord.section} size="sm">
              {practiceRecord.section}
            </Badge>
          )}
          <Badge variant="reattempt" value={reattempt.result} size="sm">
            {reattempt.result}
          </Badge>
        </div>
        <span className="text-xs text-gray-400">{dateStr}</span>
      </div>

      <div className="mt-2.5">
        <h4 className="font-bold text-gray-900 text-sm">
          {practiceRecord ? practiceRecord.topic : 'Question Reattempt'}
        </h4>
        {practiceRecord?.subtopic && (
          <p className="text-xs text-gray-500 mt-0.5">{practiceRecord.subtopic}</p>
        )}
      </div>

      {reattempt.notes && (
        <div className="mt-3 p-2.5 bg-emerald-50/50 rounded-lg text-xs text-emerald-950 border border-emerald-100">
          <span className="font-semibold block mb-0.5">Improvement Reflection:</span>
          <p className="italic">"{reattempt.notes}"</p>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span>Reattempt Time: <strong className="text-gray-800">{reattempt.timeTaken}s</strong></span>
        </div>

        {originalTime > 0 && (
          <span
            className={`font-semibold ${
              timeDiff > 0 ? 'text-emerald-600' : timeDiff === 0 ? 'text-gray-500' : 'text-rose-500'
            }`}
          >
            {timeDiff > 0 ? `Saved ${timeDiff}s ⚡` : timeDiff < 0 ? `+${Math.abs(timeDiff)}s slower` : 'Same time'}
          </span>
        )}
      </div>
    </Card>
  );
}
