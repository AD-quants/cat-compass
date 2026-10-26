'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PracticeRecord, Section } from '@/lib/types';
import { BookOpen, BrainCircuit, Calculator } from 'lucide-react';

interface SectionPerformanceProps {
  records: PracticeRecord[];
}

export function SectionPerformance({ records }: SectionPerformanceProps) {
  const sections: { key: Section; title: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'VARC', title: 'Verbal Ability & RC', icon: BookOpen },
    { key: 'DILR', title: 'Data Interpretation & LR', icon: BrainCircuit },
    { key: 'Quant', title: 'Quantitative Aptitude', icon: Calculator },
  ];

  const getStats = (section: Section) => {
    const secRecords = records.filter((r) => r.section === section);
    const total = secRecords.length;
    if (total === 0) {
      return {
        total: 0,
        correct: 0,
        incorrect: 0,
        skipped: 0,
        accuracy: 0,
        avgTimeTaken: 0,
        avgExpectedTime: 0,
      };
    }

    const correct = secRecords.filter((r) => r.outcome === 'Correct').length;
    const incorrect = secRecords.filter((r) => r.outcome === 'Incorrect').length;
    const skipped = secRecords.filter((r) => r.outcome === 'Skipped').length;
    const accuracy = Math.round((correct / total) * 100);

    const totalTime = secRecords.reduce((acc, r) => acc + r.timeTaken, 0);
    const totalExpected = secRecords.reduce((acc, r) => acc + r.expectedTime, 0);
    const avgTimeTaken = Math.round(totalTime / total);
    const avgExpectedTime = Math.round(totalExpected / total);

    return {
      total,
      correct,
      incorrect,
      skipped,
      accuracy,
      avgTimeTaken,
      avgExpectedTime,
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {sections.map(({ key, title, icon: Icon }) => {
        const stats = getStats(key);

        return (
          <Card key={key} hoverEffect className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{key}</h4>
                    <p className="text-xs text-gray-500">{title}</p>
                  </div>
                </div>
                <Badge variant="section" value={key}>
                  {stats.total} {stats.total === 1 ? 'Ques' : 'Questions'}
                </Badge>
              </div>

              {/* Accuracy progress bar */}
              <div className="mt-2">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-medium text-gray-600">Accuracy</span>
                  <span className="font-bold text-gray-900">{stats.accuracy}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${stats.accuracy}%` }}
                  />
                  <div
                    className="h-full bg-rose-400 transition-all duration-500"
                    style={{ width: `${Math.round((stats.incorrect / (stats.total || 1)) * 100)}%` }}
                  />
                  <div
                    className="h-full bg-slate-300 transition-all duration-500"
                    style={{ width: `${Math.round((stats.skipped / (stats.total || 1)) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Breakdown counts */}
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                  <p className="text-[11px] text-emerald-700 font-semibold">Correct</p>
                  <p className="text-base font-bold text-emerald-900 mt-0.5">{stats.correct}</p>
                </div>
                <div className="p-2 rounded-lg bg-rose-50/60 border border-rose-100">
                  <p className="text-[11px] text-rose-700 font-semibold">Incorrect</p>
                  <p className="text-base font-bold text-rose-900 mt-0.5">{stats.incorrect}</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-[11px] text-slate-600 font-semibold">Skipped</p>
                  <p className="text-base font-bold text-slate-800 mt-0.5">{stats.skipped}</p>
                </div>
              </div>
            </div>

            {/* Time metric */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Avg Speed:</span>
              <span className="font-semibold text-gray-700">
                {stats.avgTimeTaken}s <span className="font-normal text-gray-400">(target {stats.avgExpectedTime}s)</span>
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
