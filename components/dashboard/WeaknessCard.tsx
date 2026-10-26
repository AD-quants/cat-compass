'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge, PriorityLevel } from '@/components/ui/Badge';
import { Weakness } from '@/lib/types';
import { Clock, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface WeaknessCardProps {
  weakness: Weakness;
  rank?: number;
}

export function WeaknessCard({ weakness, rank }: WeaknessCardProps) {
  let priorityLevel: PriorityLevel = 'Medium';
  if (weakness.priorityScore >= 12) priorityLevel = 'Critical';
  else if (weakness.priorityScore >= 8) priorityLevel = 'High';
  else if (weakness.priorityScore < 5) priorityLevel = 'Low';

  const timeLostMinutes = Math.round(weakness.avgTimeLost / 60);

  return (
    <Card hoverEffect className="flex flex-col justify-between border-l-4 border-l-rose-500">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            {rank !== undefined && (
              <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center shrink-0">
                #{rank}
              </span>
            )}
            <Badge variant="section" value={weakness.section}>
              {weakness.section}
            </Badge>
            <Badge variant="priority" value={priorityLevel}>
              {priorityLevel} Priority ({weakness.priorityScore} pts)
            </Badge>
          </div>
          {weakness.errorCategory && (
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
              {weakness.errorCategory}
            </span>
          )}
        </div>

        <h4 className="text-base font-semibold text-gray-900 mt-1">{weakness.topic}</h4>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{weakness.reason}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-medium text-gray-700">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            {weakness.unresolvedCount} unresolved
          </span>
          <span className="flex items-center gap-1 font-medium text-gray-700">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            ~{timeLostMinutes}m lost/err
          </span>
        </div>

        <Link
          href={`/reattempts?section=${encodeURIComponent(weakness.section)}`}
          className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Fix Now <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
}
